
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { audioManager } from '@/lib/audio';
import { PROMPTS } from '@/lib/prompts'; // Import Prompts

// Audio Context Config
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000; // Gemini Live usually returns 24kHz

// Helper: Base64 Decode
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Base64 Encode
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert Float32 to PCM16 Blob
function createPcmBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values
    let s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// Helper: Decode Audio Data
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = OUTPUT_SAMPLE_RATE,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const useLiveAI = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [volume, setVolume] = useState(0); // For visualizer (0-100)
  const [error, setError] = useState<string | null>(null);

  // Refs for Audio Management
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null); // Gemini Live Session
  const nextStartTimeRef = useRef<number>(0);
  const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const connect = useCallback(async () => {
    try {
      setError(null);
      
      // 1. Initialize API
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY });
      
      // 2. Get Audio Contexts from Singleton Manager
      await audioManager.resumeAll(); // Ensure contexts are running (must be triggered by user gesture)
      
      inputContextRef.current = audioManager.getContext(INPUT_SAMPLE_RATE);
      outputContextRef.current = audioManager.getContext(OUTPUT_SAMPLE_RATE);
      
      // Analyzer for Visualizer (Re-create or reuse? Reuse is safer if context persists)
      if (!analyzerRef.current || analyzerRef.current.context !== outputContextRef.current) {
          analyzerRef.current = outputContextRef.current.createAnalyser();
          analyzerRef.current.fftSize = 256;
      }
      
      // 3. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 4. Connect to Gemini Live
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connected');
            setIsConnected(true);
            
            // Start Audio Pipeline
            if (!inputContextRef.current || !streamRef.current) return;
            
            // Create source only when needed
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            sourceRef.current = source;
            
            // Use ScriptProcessor for raw PCM access
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              // Send to Gemini
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle Audio Output
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputContextRef.current) {
                const ctx = outputContextRef.current;
                const audioBuffer = await decodeAudioData(decode(audioData), ctx);
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                
                // Connect to Analyzer -> Destination
                if (analyzerRef.current) {
                    source.connect(analyzerRef.current);
                    analyzerRef.current.connect(ctx.destination);
                } else {
                    source.connect(ctx.destination);
                }

                // Schedule playback
                const now = ctx.currentTime;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, now);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                
                setIsSpeaking(true);
                audioQueueRef.current.push(source);
                
                source.onended = () => {
                    // Cleanup queue
                    audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
                    if (audioQueueRef.current.length === 0) {
                        setIsSpeaking(false);
                    }
                };
            }

            // Handle Interruption
            if (msg.serverContent?.interrupted) {
                console.log('Model interrupted');
                audioQueueRef.current.forEach(s => s.stop());
                audioQueueRef.current = [];
                nextStartTimeRef.current = 0;
                setIsSpeaking(false);
            }
          },
          onclose: () => {
            console.log('Gemini Live Closed');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error('Gemini Live Error', err);
            setError('连接中断，请重试');
            disconnect();
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: PROMPTS.LIVE.SYSTEM_INSTRUCTION, // Use Centralized Prompt
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (e: any) {
      console.error(e);
      // More descriptive error message
      let errorMsg = e.message || '无法启动语音服务';
      if (errorMsg.includes('Permission denied')) errorMsg = '请允许访问麦克风';
      
      setError(errorMsg);
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    // 1. Stop Audio Tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;

    // 2. Disconnect Nodes (but don't close the shared contexts)
    sourceRef.current?.disconnect();
    processorRef.current?.disconnect();
    
    // 4. Close Session
    if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close());
    }

    setIsConnected(false);
    setIsSpeaking(false);
    setVolume(0);
  }, []);

  // Visualizer Loop
  useEffect(() => {
      let rafId: number;
      
      const updateVolume = () => {
          if (analyzerRef.current && isSpeaking) {
              const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
              analyzerRef.current.getByteFrequencyData(dataArray);
              
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setVolume(avg); 
          } else {
              setVolume(v => Math.max(0, v - 5)); // Decay
          }
          rafId = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
      return () => cancelAnimationFrame(rafId);
  }, [isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
      return () => disconnect();
  }, [disconnect]);

  return { connect, disconnect, isConnected, isSpeaking, volume, error };
};
