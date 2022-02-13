import React from 'react';

export interface DisplayOptions {
  content: React.ReactNode;
  onDestroy?: () => any;
}

export interface DisplayManager {
  show: (options: DisplayOptions) => any;
  destroy: () => any;
}

const DisplayContext = React.createContext<DisplayManager>(null as any);

export const DisplayProvider = DisplayContext.Provider;
export const DisplayConsumer = DisplayContext.Consumer;
