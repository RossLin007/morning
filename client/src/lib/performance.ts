/**
 * Performance Monitoring Utility
 *
 * Tracks and logs performance metrics for the application.
 * Integrates with the existing monitor system for centralized logging.
 */

import React from 'react';
import { monitor } from './monitor';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

interface PerformanceEntry {
  startTime: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private entries: Map<string, PerformanceEntry> = new Map();
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100; // Keep last 100 metrics

  /**
   * Start measuring a performance operation
   *
   * @example
   * performance.start('api-call', { endpoint: '/user' });
   */
  start(name: string, metadata?: Record<string, unknown>): void {
    this.entries.set(name, {
      startTime: performance.now(),
      metadata,
    });
  }

  /**
   * End measuring and log the performance operation
   *
   * @example
   * performance.end('api-call');
   */
  end(name: string, additionalMetadata?: Record<string, unknown>): number {
    const entry = this.entries.get(name);
    if (!entry) {
      console.warn(`[Performance] No entry found for: ${name}`);
      return 0;
    }

    const duration = performance.now() - entry.startTime;
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata: { ...entry.metadata, ...additionalMetadata },
    };

    // Store metric
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Clean up entry
    this.entries.delete(name);

    // Log to monitor if duration exceeds threshold
    const threshold = this.getThreshold(name);
    if (duration > threshold) {
      monitor.logAction('performance_slow', {
        name,
        duration: Math.round(duration),
        threshold,
        ...metric.metadata,
      });
    } else {
      monitor.logAction('performance', {
        name,
        duration: Math.round(duration),
        ...metric.metadata,
      });
    }

    return duration;
  }

  /**
   * Measure a function's execution time automatically
   *
   * @example
   * const result = await performance.measure('db-query', () => db.query(...));
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.start(name, metadata);
    try {
      return await fn();
    } finally {
      this.end(name);
    }
  }

  /**
   * Get performance threshold for a given operation name
   */
  private getThreshold(name: string): number {
    // Define thresholds for different operations (in milliseconds)
    const thresholds: Record<string, number> = {
      // AI operations
      'ai-chat': 5000,
      'ai-safety-check': 3000,

      // API calls
      'api-fetch': 2000,
      'api-mutation': 3000,

      // Database
      'db-query': 500,
      'db-mutation': 1000,

      // Rendering
      'render': 16, // ~60fps
      'render-slow': 100,

      // Default
      default: 1000,
    };

    // Match by prefix
    for (const [key, threshold] of Object.entries(thresholds)) {
      if (key !== 'default' && name.startsWith(key)) {
        return threshold;
      }
    }

    return thresholds.default;
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics filtered by name
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  /**
   * Get statistics for a specific operation
   */
  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;

    const durations = metrics.map(m => m.duration);
    return {
      avg: durations.reduce((a, b) => a + b, 0) / durations.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      count: metrics.length,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
    this.entries.clear();
  }

  /**
   * Log a Web Vitals metric
   */
  logWebVital(metric: {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
  }): void {
    monitor.logAction('web_vital', {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
    });

    // Also add to metrics
    this.metrics.push({
      name: `web-vital-${metric.name}`,
      duration: metric.value,
      timestamp: Date.now(),
      metadata: { rating: metric.rating },
    });
  }

  /**
   * Measure Core Web Vitals (call in browser)
   */
  async measureCoreWebVitals(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      // Dynamically import web-vitals
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

      getCLS((metric) => this.logWebVital({ ...metric, rating: metric.rating as any }));
      getFID((metric) => this.logWebVital({ ...metric, rating: metric.rating as any }));
      getFCP((metric) => this.logWebVital({ ...metric, rating: metric.rating as any }));
      getLCP((metric) => this.logWebVital({ ...metric, rating: metric.rating as any }));
      getTTFB((metric) => this.logWebVital({ ...metric, rating: metric.rating as any }));
    } catch (err) {
      console.warn('[Performance] Failed to load web-vitals:', err);
    }
  }
}

// Global singleton
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring class methods (TypeScript)
 *
 * @example
 * class MyClass {
 *   @MeasurePerformance()
 *   myMethod() { ... }
 * }
 */
export function MeasurePerformance(metadata?: Record<string, unknown>) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const name = `${target.constructor.name}.${propertyKey}`;
      performanceMonitor.start(name, metadata);
      try {
        return await originalMethod.apply(this, args);
      } finally {
        performanceMonitor.end(name);
      }
    };

    return descriptor;
  };
}

/**
 * Hook for measuring component render performance
 */
export function useRenderPerformance(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.metrics.push({
        name: `render-${componentName}`,
        duration,
        timestamp: Date.now(),
      });

      // Warn if render takes too long
      if (duration > 16) {
        console.warn(`[Performance] Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
}
