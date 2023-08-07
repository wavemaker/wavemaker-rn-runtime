export interface I18nService {
    getSelectedLocale: () => string;
    isRTLLocale: (newLocale?: string) => any;
    setRTL: (locale?: string) => any;
}

