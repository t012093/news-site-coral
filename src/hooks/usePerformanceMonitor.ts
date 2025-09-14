import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observer?: PerformanceObserver;

  constructor() {
    this.initializeObserver();
    this.measureTTFB();
  }

  private initializeObserver() {
    if ('PerformanceObserver' in window) {
      // Observe Core Web Vitals
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              this.metrics.lcp = entry.startTime;
              break;
            case 'first-input':
              this.metrics.fid = entry.processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                this.metrics.cls = (this.metrics.cls || 0) + (entry as any).value;
              }
              break;
          }
        });
      });

      try {
        this.observer.observe({ type: 'largest-contentful-paint', buffered: true });
        this.observer.observe({ type: 'first-input', buffered: true });
        this.observer.observe({ type: 'layout-shift', buffered: true });
      } catch (error) {
        console.warn('Performance observer not supported for some metrics:', error);
      }
    }

    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        });
      });

      try {
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (error) {
        console.warn('FCP observer not supported:', error);
      }
    }
  }

  private measureTTFB() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    console.group('🚀 Performance Metrics');
    
    if (metrics.fcp) {
      console.log(`⚡ First Contentful Paint: ${metrics.fcp.toFixed(2)}ms`);
    }
    
    if (metrics.lcp) {
      const rating = metrics.lcp <= 2500 ? '✅ Good' : metrics.lcp <= 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`🎨 Largest Contentful Paint: ${metrics.lcp.toFixed(2)}ms (${rating})`);
    }
    
    if (metrics.fid !== undefined) {
      const rating = metrics.fid <= 100 ? '✅ Good' : metrics.fid <= 300 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`⚡ First Input Delay: ${metrics.fid.toFixed(2)}ms (${rating})`);
    }
    
    if (metrics.cls !== undefined) {
      const rating = metrics.cls <= 0.1 ? '✅ Good' : metrics.cls <= 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`📐 Cumulative Layout Shift: ${metrics.cls.toFixed(3)} (${rating})`);
    }
    
    if (metrics.ttfb) {
      const rating = metrics.ttfb <= 800 ? '✅ Good' : metrics.ttfb <= 1800 ? '⚠️ Needs Improvement' : '❌ Poor';
      console.log(`🌐 Time to First Byte: ${metrics.ttfb.toFixed(2)}ms (${rating})`);
    }
    
    console.groupEnd();
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const usePerformanceMonitor = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const monitor = new PerformanceMonitor();

    // Log metrics after page load
    const logTimeout = setTimeout(() => {
      monitor.logMetrics();
    }, 5000);

    // Log metrics when page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        monitor.logMetrics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      monitor.disconnect();
      clearTimeout(logTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  const measureCustomMetric = useCallback((name: string, startTime: number) => {
    const duration = performance.now() - startTime;
    console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }, []);

  const markStart = useCallback((name: string) => {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-start`);
    }
    return performance.now();
  }, []);

  const markEnd = useCallback((name: string) => {
    const endTime = performance.now();
    if ('performance' in window && 'mark' in performance && 'measure' in performance) {
      try {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return endTime;
  }, []);

  return {
    measureCustomMetric,
    markStart,
    markEnd
  };
};

export default usePerformanceMonitor;