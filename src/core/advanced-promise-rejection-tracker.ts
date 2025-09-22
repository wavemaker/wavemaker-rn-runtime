/**
 * Advanced Promise Rejection Tracker
 *
 * Provides comprehensive promise rejection tracking across different JavaScript engines.
 * This module addresses the critical gap where API call failures and async function errors
 * are not caught by React Error Boundaries, ensuring all promise rejections are handled.
 *
 * Engine Support:
 * - Web: Uses browser's 'unhandledrejection' event
 * - Hermes: Uses HermesInternal.enablePromiseRejectionTracker
 * - JSC: Uses React Native's 'promise/setimmediate/rejection-tracking' module
 *
 * Coverage Includes:
 * - API call failures (fetch, axios, any HTTP library)
 * - Async function errors (unhandled throws in async/await)
 * - Manual Promise.reject() calls
 * - Third-party library promise rejections
 *
 * Research Notes:
 * This implementation was developed through extensive research into React Native's
 * promise handling across different engines. Each engine has its own optimal approach:
 * - Hermes provides a native tracking API that hooks into the engine's internals
 * - JSC can use React Native's internal promise tracking module
 * - Web browsers have standardized unhandledrejection events
 *
 * The approach automatically detects the best available method and falls back
 * gracefully when native tracking is unavailable.
 */

import { Platform } from 'react-native';

// TypeScript declarations for global objects
declare global {
  interface Global {
    HermesInternal?: {
      enablePromiseRejectionTracker?: (options: {
        allRejections: boolean;
        onUnhandled: (id: number, error: any) => void;
        onHandled: (id: number) => void;
      }) => void;
    };
  }
}

export interface PromiseRejectionHandler {
  (error: any): void;
}

/**
 * Multi-engine promise rejection tracking implementation
 */
export class AdvancedPromiseRejectionTracker {
  private onRejectionHandler: PromiseRejectionHandler;
  private cleanupFunctions: (() => void)[] = [];

  constructor(onRejection: PromiseRejectionHandler) {
    this.onRejectionHandler = onRejection;
  }

  /**
   * Setup promise rejection tracking based on available APIs
   * Returns true if native tracking was enabled, false if fallback used
   */
  public setup(): boolean {
    // Automatically detect and setup the best available promise rejection tracking method

    if (Platform.OS === 'web') {
      return this.setupWebTracking();
    }

    // For mobile platforms, try native tracking methods in order of preference
    if (this.setupHermesTracking()) {
      return true;
    }

    // Fallback to React Native internal tracking for JSC
    if (this.setupReactNativeTracking()) {
      return true;
    }

    // No native tracking available - this should rarely happen in modern RN versions
    return false;
  }

  /**
   * Method 1: Web Environment - Use unhandledrejection event
   */
  private setupWebTracking(): boolean {
    try {
      if (typeof window === 'undefined' || !window.addEventListener) {
        return false;
      }

      const handler = (event: PromiseRejectionEvent) => {
        event.preventDefault(); // Prevent browser's default handling
        const error =
          event.reason instanceof Error
            ? event.reason
            : new Error(String(event.reason));
        this.onRejectionHandler(error);
      };

      window.addEventListener('unhandledrejection', handler);
      this.cleanupFunctions.push(() => {
        window.removeEventListener('unhandledrejection', handler);
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Method 2: Hermes Engine - Use HermesInternal API
   */
  private setupHermesTracking(): boolean {
    try {
      // Check if Hermes engine is available
      const hermesInternal = (global as any).HermesInternal;
      if (
        hermesInternal &&
        typeof hermesInternal.enablePromiseRejectionTracker === 'function'
      ) {
        hermesInternal.enablePromiseRejectionTracker({
          allRejections: true, // Track both handled and unhandled rejections
          onUnhandled: (id: number, error: any) => {
            this.onRejectionHandler(error);
          },
          onHandled: (id: number) => {
            // Promise was handled later - could be used for analytics in the future
          },
        });

        // Cleanup function (if available)
        this.cleanupFunctions.push(() => {
          // Hermes doesn't provide a disable method, but we can set a no-op handler
          if (hermesInternal?.enablePromiseRejectionTracker) {
            hermesInternal.enablePromiseRejectionTracker({
              allRejections: false,
              onUnhandled: () => {},
              onHandled: () => {},
            });
          }
        });

        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Method 3: React Native Internal - Use promise/setimmediate/rejection-tracking for JSC
   */
  private setupReactNativeTracking(): boolean {
    try {
      // Try to access React Native's internal promise tracking module
      const tracking = require('promise/setimmediate/rejection-tracking');

      if (tracking && typeof tracking.enable === 'function') {
        tracking.enable({
          allRejections: true,
          onUnhandled: (id: number, error: any) => {
            this.onRejectionHandler(error);
          },
          onHandled: (id: number) => {
            // Promise was handled later - tracking for potential analytics
          },
        });

        this.cleanupFunctions.push(() => {
          // Try to disable tracking if possible
          if (tracking.disable && typeof tracking.disable === 'function') {
            tracking.disable();
          }
        });

        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Clean up all tracking mechanisms
   */
  public cleanup(): void {
    // Clean up all tracking mechanisms and restore original state
    this.cleanupFunctions.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        // Silently handle cleanup errors to avoid disrupting app shutdown
      }
    });
    this.cleanupFunctions = [];
  }
}

/**
 * Helper function to detect JavaScript engine (simplified for Web/Hermes/JSC)
 */
export function detectJavaScriptEngine(): 'web' | 'hermes' | 'jsc' {
  if (Platform.OS === 'web') {
    return 'web';
  }

  if (typeof (global as any).HermesInternal !== 'undefined') {
    return 'hermes';
  }

  // For non-Hermes engines on mobile, assume JSC (most common)
  return 'jsc';
}

/**
 * Public API for easy integration
 */
/**
 * Sets up advanced promise rejection tracking with automatic engine detection
 * @param onRejection Callback function to handle unhandled promise rejections
 * @returns AdvancedPromiseRejectionTracker instance for cleanup and testing
 */
export function setupAdvancedPromiseRejectionTracking(
  onRejection: PromiseRejectionHandler
): AdvancedPromiseRejectionTracker {
  const tracker = new AdvancedPromiseRejectionTracker(onRejection);
  tracker.setup();
  return tracker;
}
