// Standardize the model usage across the app
export const DEFAULT_AI_MODEL = 'gemini-2.0-flash';

class AIService {
  private baseUrl = '/api/genai';

  /**
   * Generates a single response from a text prompt via backend proxy.
   */
  async generateText(prompt: string, systemInstruction?: string): Promise<string> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'AI request failed');
      }

      const data = await response.json();
      return data.text || '';
    } catch (error: any) {
      console.error("AI Service Error:", error);
      throw error;
    }
  }

  /**
   * Check if content is safe for the community.
   */
  async checkContentSafety(content: string): Promise<{ safe: boolean; reason?: string }> {
    try {
      const prompt = `
        Evaluate if the following text is appropriate for a supportive, public learning community.
        Text: "${content}"
        
        Strictly forbidden: Hate speech, explicit violence, sexual content, harassment, spam.
        
        Respond ONLY with a JSON object in this format:
        { "safe": boolean, "reason": "short explanation if unsafe" }
      `;

      const result = await this.generateText(prompt, "You are a strict content moderator. Output valid JSON only.");
      const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const json = JSON.parse(cleanResult);
      
      return {
        safe: typeof json.safe === 'boolean' ? json.safe : true,
        reason: json.reason
      };
    } catch (e) {
      console.error("Safety Check Failed:", e);
      return { safe: true };
    }
  }

  /**
   * Creates a chat session proxy that communicates with the backend.
   */
  createChatSession(history: any[] = [], systemInstruction?: string) {
    return {
      sendMessage: async (prompt: string) => {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, history, systemInstruction }),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return await response.json();
      },
      
      // Temporary non-streaming implementation that mimics the stream interface
      sendMessageStream: async function* ({ message }: { message: string }) {
        const response = await fetch('/api/genai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message, history, systemInstruction }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Stream request failed');
        }

        const data = await response.json();
        // Mimic the SDK's response structure
        yield {
          text: data.text,
          candidates: data.candidates || []
        };
      }
    };
  }
}

export const aiService = new AIService();