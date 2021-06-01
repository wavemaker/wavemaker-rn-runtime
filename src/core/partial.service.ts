import React from 'react';

export default interface PartialService {
    get: (partialName: string) => any;
}

const PartialContext = React.createContext<PartialService>(null as any);

export const PartialProvider = PartialContext.Provider;
export const PartialConsumer = PartialContext.Consumer;