import React from 'react';

export default interface NavigationService {
    goToPage: (pageName: string, params: any) => Promise<void>;
    goBack: (pageName: string, params: any) => Promise<void>;
    openUrl: (url: string) => Promise<void>;
}

const NavigationContext = React.createContext<NavigationService>(null as any);

export const NavigationServiceProvider = NavigationContext.Provider;
export const NavigationServiceConsumer = NavigationContext.Consumer;