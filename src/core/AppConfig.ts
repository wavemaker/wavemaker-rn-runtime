export interface Drawer {
    setContent: (c: React.ReactNode) => void;
    getContent: () => React.ReactNode;
    setAnimation: (animation: string) => void;
    getAnimation: () => string;
}

export default interface AppConfig {
    assets: any;
    appProperties: any;
    appLocale: any;
    url: string;
    loadApp: boolean;
    refresh: (complete?: boolean) => void,
    currentPage?: any;
    pages?: any[];
    landingPage: string;
    partials?: any[];
    drawer: Drawer;
    app: any;
    setDrawerContent: any;
    theme: any;
    drawerType: any;
    getServiceDefinitions: any;
    loggedInUser: any;
    selectedLocale: string;
}