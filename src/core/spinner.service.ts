import React from 'react';

export interface DisplayOptions {
  content?: React.ReactNode;
  message?: string;
  spinner?: any;
}

export interface SpinnerService {
  show: (options: DisplayOptions) => any;
  hide: (options: DisplayOptions) => any;
}

const SpinnerContext = React.createContext<SpinnerService>(null as any);

export const SpinnerProvider = SpinnerContext.Provider;
export const SpinnerConsumer = SpinnerContext.Consumer;
