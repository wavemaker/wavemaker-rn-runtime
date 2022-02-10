import React from 'react';

export interface SecurityOptions {}

export interface SecurityService {
    isLoggedIn: Boolean;
    loggedInUser: any;
    appLogin: (options: SecurityOptions, success?: any, failure?: any) => any;
    appLogout: (options: any, success?: any, failure?: any) => any;
    navigateToLandingPage: (data: any) => any;
}

const SecurityContext = React.createContext<SecurityService>(null as any);

export const SecurityProvider = SecurityContext.Provider;
export const SecurityConsumer = SecurityContext.Consumer;
