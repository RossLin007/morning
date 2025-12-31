
/**
 * Audio Context Manager
 * 
 * Browsers typically limit the number of active AudioContexts (often to 6).
 * This singleton manages contexts to prevent resource exhaustion errors.
 * It also handles the 'resume' logic required by browsers for autoplay policies.
 */

class AudioContextManager {
  private static instance: AudioContextManager;
  private contexts: Map<number, AudioContext> = new Map();

  private constructor() {}

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  /**
   * Get or create an AudioContext for a specific sample rate.
   * Note: Reusing contexts for different sample rates isn't standard, 
   * so we key them by sample rate.
   */
  public getContext(sampleRate: number = 24000): AudioContext {
    let ctx = this.contexts.get(sampleRate);

    if (!ctx || ctx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioContextClass({ sampleRate });
      this.contexts.set(sampleRate, ctx);
      console.debug(`[Audio] Created new AudioContext (${sampleRate}Hz)`);
    }

    return ctx;
  }

  /**
   * Resumes all active contexts. 
   * Must be called within a user interaction event handler (click/touch).
   */
  public async resumeAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const ctx of this.contexts.values()) {
      if (ctx.state === 'suspended') {
        promises.push(ctx.resume());
      }
    }
    await Promise.all(promises);
  }

  /**
   * Suspend all contexts to save battery/processing when not in use.
   */
  public async suspendAll(): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const ctx of this.contexts.values()) {
      if (ctx.state === 'running') {
        promises.push(ctx.suspend());
      }
    }
    await Promise.all(promises);
  }

  /**
   * Force close specific context (e.g. on page unload or fatal error)
   */
  public close(sampleRate: number) {
      const ctx = this.contexts.get(sampleRate);
      if (ctx) {
          ctx.close();
          this.contexts.delete(sampleRate);
      }
  }
}

export const audioManager = AudioContextManager.getInstance();
