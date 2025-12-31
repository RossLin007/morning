
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { monitor } from '@/lib/monitor';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error using our new monitor service
    monitor.logError(error, { componentStack: errorInfo.componentStack });
  }

  private handleBackToHome = () => {
      // Safe navigation for HashRouter environments
      // 1. Reset URL hash to root
      window.location.hash = '/';
      // 2. Reload to ensure clean React state
      window.location.reload();
  };

  private handleClearData = () => {
      if (window.confirm("确定要清除本地缓存吗？这可能修复持续崩溃的问题。")) {
          localStorage.clear();
          this.handleBackToHome();
      }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F7F5] dark:bg-[#0A0A0A] text-text-main dark:text-white p-6 text-center relative z-[100]">
          <div className="size-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <Icon name="healing" className="text-4xl text-red-500" />
          </div>
          <h1 className="text-xl font-display font-bold mb-2">遇到了一点小波折</h1>
          <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
            生活总有意外，修行也是如此。<br/>
            我们的工程师已收到通知，请尝试刷新。
          </p>
          <div className="flex gap-4">
             <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors active:scale-95"
             >
                刷新页面
             </button>
             <button
                onClick={this.handleBackToHome}
                className="px-6 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-full font-bold transition-colors hover:bg-gray-50 dark:hover:bg-white/20 active:scale-95"
             >
                返回首页
             </button>
          </div>
          
          <button 
            onClick={this.handleClearData}
            className="mt-8 text-xs text-gray-400 underline hover:text-gray-600 transition-colors"
          >
            如果问题持续，尝试清除缓存
          </button>

          {this.state.error && import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-sm overflow-auto text-left w-full max-h-40 border border-gray-200 dark:border-gray-700">
                  <p className="text-[10px] font-mono text-red-500 break-words">
                      {this.state.error.toString()}
                  </p>
              </div>
          )}
        </div>
      );
    }

    return (this as any).props.children;
  }
}
