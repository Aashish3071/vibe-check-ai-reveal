import { useEffect } from "react";
import { usePerformanceMonitor } from "./performance";

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private readonly endpoint: string;
  private readonly batchSize: number = 10;
  private readonly flushInterval: number = 10000; // 10 seconds

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.startFlushInterval();
  }

  public track(eventName: string, properties?: Record<string, unknown>) {
    this.events.push({
      name: eventName,
      properties,
      timestamp: Date.now(),
    });

    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  private async flush() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventsToSend),
      });
    } catch (error) {
      console.error("Failed to send analytics events:", error);
      // Requeue failed events
      this.events = [...eventsToSend, ...this.events];
    }
  }

  private startFlushInterval() {
    setInterval(() => this.flush(), this.flushInterval);
  }
}

// Initialize analytics service
export const analytics = new AnalyticsService(
  import.meta.env.VITE_ANALYTICS_ENDPOINT
);

// React hook for performance monitoring
export function useAnalytics() {
  // Track page views
  useEffect(() => {
    analytics.track("page_view", {
      path: window.location.pathname,
      referrer: document.referrer,
    });
  }, []);

  // Monitor performance
  usePerformanceMonitor((metrics) => {
    analytics.track("performance_metrics", {
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: metrics.largestContentfulPaint,
      timeToInteractive: metrics.timeToInteractive,
    });
  });

  return {
    track: analytics.track.bind(analytics),
  };
}

// Error tracking
export function trackError(error: Error, context?: Record<string, unknown>) {
  analytics.track("error", {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

// User interaction tracking
export function trackInteraction(
  element: string,
  action: string,
  properties?: Record<string, unknown>
) {
  analytics.track("interaction", {
    element,
    action,
    ...properties,
  });
}
