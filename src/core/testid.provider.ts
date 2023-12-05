import React from 'react';

const TextIdPrefixContext = React.createContext<string | undefined>(null as any);

export const TestIdPrefixProvider = TextIdPrefixContext.Provider;
export const TextIdPrefixConsumer = TextIdPrefixContext.Consumer;