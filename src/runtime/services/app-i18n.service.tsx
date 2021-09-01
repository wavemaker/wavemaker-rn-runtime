import axios, { AxiosResponse } from 'axios';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AsyncStorage from '@react-native-async-storage/async-storage';


const APP_LOCALE_ROOT_PATH = '/resources/i18n';
class AppI18nService {
    appLocale: any;
    defaultSupportedLocale = 'en';
    selectedLocale: any;
    dateFormat: string = '';
    timeFormat: string = '';
    dateTimeFormat: string = '';
    currencyCode: string = '';

    constructor() {
        this.getSelectedLocale().then((locale) => this.selectedLocale = locale || '');
    }

    loadAppLocaleBundle(url: string) {
        const appConfig = injector.get<AppConfig>('APP_CONFIG');
        if (!this.selectedLocale) {
            this.selectedLocale = appConfig.appProperties.preferBrowserLang == 'false'? appConfig.appProperties.defaultLanguage : this.defaultSupportedLocale;
            appConfig.selectedLocale = this.selectedLocale;
        }
        const path = `${url + APP_LOCALE_ROOT_PATH}/${this.selectedLocale}.json`;
        return axios.get(path)
            .then((bundle) => {
                this.dateFormat = bundle.data.formats.date;
                this.timeFormat = bundle.data.formats.time;
                this.currencyCode = bundle.data.formats.currency;
                this.dateTimeFormat = this.dateFormat + ' ' + this.timeFormat;
                return bundle;
            })
            .catch(() => {
                console.warn(`error loading locale resource from ${path}`);
            });
    }

    setSelectedLocale(locale: string) {
        this.selectedLocale = locale;
        AsyncStorage.setItem('selectedLocale', locale);
    }

    async getSelectedLocale() {
        return await AsyncStorage.getItem('selectedLocale');
    }
}

const i18nService = new AppI18nService();

export default i18nService;