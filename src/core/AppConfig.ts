export interface Drawer {
    setContent: (c: React.ReactNode) => void;
    getContent: () => React.ReactNode;
    setAnimation: (animation: string) => void;
    getAnimation: () => string;
}

export default interface AppConfig {
    url: string;
    wavIconAsset: any,
    loadApp: boolean;
    refresh: () => void,
    currentPage?: any;
    pages?: any[];
    partials?: any[];
    drawer: Drawer;
    app: any;
    setDrawerContent: any;
    drawerType: any;
    getServiceDefinitions: any;
}