import React from 'react';

const AssetContext = React.createContext<(path: string) => number | string>(null as any);

export const AssetProvider = AssetContext.Provider;
export const AssetConsumer = AssetContext.Consumer;