import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCurrencyStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-currency';
export const DEFAULT_STYLES: WmCurrencyStyles = {
    root: {
      height: 38,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
