import React from 'react';

export interface SecurityOptions {
    content: React.ReactNode;
    onClick?: () => void;
    onClose?: () => void;
    name: string;
    isLoggedIn: false;
    baseURL: string;
}

export interface SecurityService {
    isLoggedIn: Boolean;
    loggedInUser: any;
    appLogin: (options: SecurityOptions) => void;
    appLogout: (options: any, success?: any, failure?: any) => any;
}

const SecurityContext = React.createContext<SecurityService>(null as any);

export const SecurityProvider = SecurityContext.Provider;
export const SecurityConsumer = SecurityContext.Consumer;