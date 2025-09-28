import React, { createContext } from 'react';

export interface ScreenCaptureProtectionContextType {
  enableProtection: () => void;
  disableProtection: () => void;
}

const ScreenCaptureProtectionContext = createContext<ScreenCaptureProtectionContextType | null>(null);

export const ScreenCaptureProtectionProvider = ScreenCaptureProtectionContext.Provider;
export const ScreenCaptureProtectionConsumer = ScreenCaptureProtectionContext.Consumer;