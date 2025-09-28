/**
 * Global Error Handler Service for WaveMaker Runtime
 *
 * This service provides comprehensive error handling for React Native applications:
 * 1. JavaScript Error Handling: Uses ErrorUtils.setGlobalHandler for sync errors
 * 2. Promise Rejection Tracking: Multi-engine approach for unhandled promise rejections
 *    - Web: Uses browser's 'unhandledrejection' event
 *    - Hermes: Uses HermesInternal.enablePromiseRejectionTracker
 *    - JSC: Uses React Native's 'promise/setimmediate/rejection-tracking' module
 *
 * Key Features:
 * - Catches ALL API call failures (fetch, axios, any HTTP library)
 * - Handles async function errors and manual Promise.reject calls
 * - Automatic engine detection and optimal method selection
 * - Production-ready with proper cleanup mechanisms
 * - Configurable suppression of React Native's default error screens
 *
 * Research Background:
 * This implementation was developed after extensive research into React Native's
 * error handling mechanisms across different JavaScript engines. It addresses
 * the common problem where API call failures and async errors are not caught
 * by standard error boundaries, providing a unified solution for all error types.
 */

import { Platform } from 'react-native';
import { isWebPreviewMode } from './utils';
import {
  setupAdvancedPromiseRejectionTracking,
  AdvancedPromiseRejectionTracker,
} from './advanced-promise-rejection-tracker';

export interface GlobalErrorState {
  error: Error;
  errorInfo: string;
  errorType: 'javascript';
  isFatal?: boolean;
}

export type GlobalErrorCallback = (
  error: Error,
  isFatal: boolean,
  errorInfo: string
) => void;

let globalErrorHandler: ((error: any, isFatal?: boolean) => void) | null = null;
let promiseRejectionTracker: AdvancedPromiseRejectionTracker | null = null;

/**
 * Sets up global error handling for JavaScript errors and unhandled promise rejections
 * @param onError Callback function to handle errors
 * @param suppressDefaultErrorScreen Whether to suppress React Native's default error screen
 * @returns Cleanup function to remove the error handlers
 */
export const setupGlobalErrorHandler = (
  onError: GlobalErrorCallback,
  suppressDefaultErrorScreen: boolean = false
): (() => void) => {
  // Store the original error handler to restore it later
  const originalHandler = ErrorUtils.getGlobalHandler();

  // Setup JavaScript error handler
  globalErrorHandler = (error: any, isFatal: boolean = false) => {
    const errorInfo = __DEV__
      ? `${error.stack || error.toString()}`
      : 'An unexpected error occurred';

    // Call our custom error handler
    onError(error, isFatal, errorInfo);

    // Call the original handler for development/debugging if not suppressed
    // This controls whether React Native's default red error screen is shown
    if (originalHandler && __DEV__ && !suppressDefaultErrorScreen) {
      originalHandler(error, isFatal);
    }
  };

  // Set our custom global error handler
  ErrorUtils.setGlobalHandler(globalErrorHandler);

  // Setup Advanced Promise Rejection Tracking
  // This automatically detects the best method for the current JavaScript engine:
  // - Web: Uses unhandledrejection event for complete coverage
  // - Hermes: Uses HermesInternal.enablePromiseRejectionTracker for native tracking
  // - JSC: Uses promise/setimmediate/rejection-tracking module for comprehensive handling
  promiseRejectionTracker = setupAdvancedPromiseRejectionTracking(
    (error: any) => {
      // Convert promise rejection to our error handler format
      const promiseError =
        error instanceof Error ? error : new Error(String(error));
      const errorInfo = __DEV__
        ? `Promise rejection: ${promiseError.stack || promiseError.toString()}`
        : 'An unexpected error occurred';

      // Call our custom error handler with promise-specific info
      // This ensures API call failures and async errors trigger the same error flow
      onError(promiseError, false, errorInfo);
    }
  );

  return () => {
    // Cleanup function - restores original error handling mechanisms
    ErrorUtils.setGlobalHandler(originalHandler);

    // Cleanup advanced promise rejection tracking
    if (promiseRejectionTracker) {
      promiseRejectionTracker.cleanup();
      promiseRejectionTracker = null;
    }

    globalErrorHandler = null;
  };
};

/**
 * Get current error handling configuration and capabilities
 * Useful for debugging and monitoring the error handling setup
 */
export const getErrorHandlingInfo = () => {
  return {
    platform: Platform.OS,
    isWebPreview: isWebPreviewMode(),
    hasPromiseTracking: promiseRejectionTracker !== null,
    hasJavaScriptHandler: globalErrorHandler !== null,
  };
};
