import axios, { AxiosResponse } from 'axios';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';


const APP_LOCALE_ROOT_PATH = '/resources/i18n';
class AppI18nService {
    appLocale: any;
    defaultSupportedLocale = 'en';
    selectedLocale: any;
    dateFormat: string = '';
    timeFormat: string = '';
    dateTimeFormat: string = '';
    currencyCode: string = '';

    constructor() {}

    loadAppLocaleBundle(url: string) {
        const appConfig = injector.get<AppConfig>('APP_CONFIG');
        return this.getSelectedLocale().then((locale) => {
          appConfig.selectedLocale = this.selectedLocale = locale || '';
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

        });
    }

    setSelectedLocale(locale: string) {
        const appConfig = injector.get<AppConfig>('APP_CONFIG');
        let key = 'selectedLocale';
        this.selectedLocale = locale;
        if (isWebPreviewMode()) {
          key = appConfig.appProperties.displayName + '_selectedLocale';
        }
        AsyncStorage.setItem(key, locale);
    }

    async getSelectedLocale() {
      const appConfig = injector.get<AppConfig>('APP_CONFIG');
      const key = isWebPreviewMode() ? appConfig && appConfig.appProperties.displayName + '_selectedLocale' : 'selectedLocale';
      return await AsyncStorage.getItem(key);
    }
}

const i18nService = new AppI18nService();

export default i18nService;
