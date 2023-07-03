import axios, { AxiosResponse } from 'axios';
import StorageService from '@wavemaker/app-rn-runtime/core/storage.service';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import { I18nManager, Platform } from 'react-native';
import { I18nService } from '@wavemaker/app-rn-runtime/core/i18n.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';

const APP_LOCALE_ROOT_PATH = '/resources/i18n';
const STORAGE_KEY = 'selectedLocale';
const RTL_LANGUAGE_CODES = (()=>{
  const map = {} as any;
  ["ar", "ar-001", "ar-ae", "ar-bh", "ar-dz", "ar-eg", "ar-iq", "ar-jo", "ar-kw", "ar-lb",
   "ar-ly", "ar-ma", "ar-om", "ar-qa", "ar-sa", "ar-sd", "ar-sy", "ar-tn", "ar-ye", "arc",
    "bcc", "bqi", "ckb", "dv", "fa", "glk", "he", "ku", "mzn", "pnb", "ps", "sd", "ug", "ur", "yi"].forEach(v=>{
      map[v] = true;
    });
    return map;
  })();

class AppI18nService implements I18nService{
    appLocale: any;
    defaultSupportedLocale = 'en';
    selectedLocale: any;
    dateFormat: string = '';
    timeFormat: string = '';
    dateTimeFormat: string = '';
    currencyCode: string = '';

    constructor() {}

    isRTLLocale(newLocale: string = this.selectedLocale){
      return !!(newLocale && RTL_LANGUAGE_CODES[newLocale]);
    }

    setRTL(locale?: string){
      const flag = this.isRTLLocale(locale);
      const needsRestart = !isWebPreviewMode() && I18nManager.isRTL !== flag;
      I18nManager.forceRTL(flag);
      return needsRestart; 
    }

    loadAppLocaleBundle(url: string) {
        return this.getSelectedLocale().then(() => {
          const path = `${url + APP_LOCALE_ROOT_PATH}/${this.selectedLocale}.json`;
          return axios.get(path)
            .then((bundle) => {
              this.dateFormat = bundle.data.formats.date;
              this.timeFormat = bundle.data.formats.time;
              this.currencyCode = bundle.data.formats.currency;
              this.dateTimeFormat = this.dateFormat + ' ' + this.timeFormat;
              injector.set('I18nService', this);
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
        return this.setRTL(locale);
    }

    async getSelectedLocale() {
      return await StorageService.getItem(STORAGE_KEY);
    }
}

const i18nService = new AppI18nService();

export default i18nService;
