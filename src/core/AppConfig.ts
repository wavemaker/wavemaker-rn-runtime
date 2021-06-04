export default interface AppConfig {
    url: string;
    loadApp: boolean;
    refresh: () => void,
    currentPage?: any;
    pages?: any[];
    partials?: any[];
    app: any;
    setDrawerContent: any;
    drawerType: any;
}