import { useEffect, useRef } from "react";
import React from "react";

// Debounce function to limit the rate of function calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function to limit the rate of function calls
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Custom hook for performance monitoring
export function usePerformanceMonitor(
  callback: (metrics: PerformanceMetrics) => void,
  interval: number = 1000
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const metrics: PerformanceMetrics = {
        firstContentfulPaint: entries.find(
          (entry) => entry.name === "first-contentful-paint"
        )?.startTime,
        largestContentfulPaint: entries.find(
          (entry) => entry.name === "largest-contentful-paint"
        )?.startTime,
        timeToInteractive: entries.find(
          (entry) => entry.name === "time-to-interactive"
        )?.startTime,
      };

      callbackRef.current(metrics);
    });

    observer.observe({ entryTypes: ["paint", "largest-contentful-paint"] });

    return () => observer.disconnect();
  }, [interval]);
}

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  timeToInteractive?: number;
}

// Image optimization utility
export function optimizeImage(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpeg" | "png";
  } = {}
): string {
  const params = new URLSearchParams();

  if (options.width) params.append("w", options.width.toString());
  if (options.height) params.append("h", options.height.toString());
  if (options.quality) params.append("q", options.quality.toString());
  if (options.format) params.append("fm", options.format);

  return `${url}?${params.toString()}`;
}

// Lazy loading utility
export function lazyLoad<T extends React.ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(importFn());
      }, 1000); // Simulate network delay for testing
    });
  });
}
