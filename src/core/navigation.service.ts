import React from 'react';
import { createNavigationContainerRef, ParamListBase } from '@react-navigation/native';

export default interface NavigationService {
    goToPage: (pageName: string, params: any) => Promise<void>;
    goBack: (pageName: string, params: any) => Promise<void>;
    openUrl: (url: string, params?: any) => Promise<void>;
}

const NavigationContext = React.createContext<NavigationService>(null as any);

export const NavigationServiceProvider = NavigationContext.Provider;
export const NavigationServiceConsumer = NavigationContext.Consumer;


// Error Boundary - Navigation handling in case of app level errors.

// Creating a navigationRef for use with NavigationContainer in App.navigator.tsx
export const navigationRef = createNavigationContainerRef<ParamListBase>();

// Flag to track whether the NavigationContainer is ready
let isNavigationReady = false;

// Queue to hold navigation actions while NavigationContainer is not ready
let pendingNavigation: (() => void)[] = [];

/**
 * Set the navigation readiness state.
 * If NavigationContainer becomes ready, flush any pending navigation actions.
 */
export function setNavigationReady(ready: boolean) {
  isNavigationReady = ready;
  if (ready) {
    flushPendingNavigation();
  }
}

/**
 * Get the current navigation readiness state.
 */
export function getNavigationReady() {
  return isNavigationReady;
}

/**
 * Execute all queued navigation actions.
 */
function flushPendingNavigation() {
  while (pendingNavigation.length > 0) {
    const action = pendingNavigation.shift();
    if (action) action();
  }
}

/**
 * Navigate to a specific screen.
 * If NavigationContainer isn't ready, queue the navigation action.
 */
export function navigate(name: string, params: any) {
  if (isNavigationReady && navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    pendingNavigation.push(() => navigationRef.navigate(name, params));
  }
}

/**
 * Navigate back to the previous screen.
 * If NavigationContainer isn't ready, queue the goBack action.
 */
export function goBackRef() {
  if (isNavigationReady && navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  } else {
    pendingNavigation.push(() => navigationRef.goBack());
  }
}

export { isNavigationReady };
