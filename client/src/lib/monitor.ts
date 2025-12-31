class Monitor {
  private errorQueue: any[] = [];
  private isProcessing: boolean = false;

  public logError(error: Error, context?: any) {
    console.error(`[Monitor] Error caught: ${error.message}`, context);
    
    this.errorQueue.push({
      message: error.message,
      stack: error.stack,
      context: JSON.stringify(context),
      url: window.location.href,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString()
    });

    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) return;
    this.isProcessing = true;

    const batch = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // Send to BFF instead of directly to Supabase
      await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch[0]) // Simplification: send first one for now
      });
    } catch (e) {
      console.warn("Failed to report error to BFF", e);
    } finally {
      this.isProcessing = false;
      if (this.errorQueue.length > 0) this.processQueue();
    }
  }
}

export const monitor = new Monitor();