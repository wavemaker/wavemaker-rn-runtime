import axios, { AxiosResponse } from 'axios';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import StorageService from '@wavemaker/app-rn-runtime/core/storage.service';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';


const APP_LOCALE_ROOT_PATH = '/resources/i18n';
const STORAGE_KEY = 'selectedLocale';
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
        return this.getSelectedLocale().then(() => {
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
        this.selectedLocale = locale;
        StorageService.setItem(STORAGE_KEY, locale);
    }

    async getSelectedLocale() {
      return await StorageService.getItem(STORAGE_KEY);
    }
}

const i18nService = new AppI18nService();

export default i18nService;
