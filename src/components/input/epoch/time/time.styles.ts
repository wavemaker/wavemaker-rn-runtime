import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { WmDatetimeStyles, DEFAULT_CLASS as DATE_TIME_DEFAUlT_CLASS } from '../datetime/datetime.styles';
import { Platform } from 'react-native';

export type WmTimeStyles = WmDatetimeStyles;

export const DEFAULT_CLASS = 'app-time';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  addStyle(DEFAULT_CLASS, DATE_TIME_DEFAUlT_CLASS, {});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    clearIcon: {
        root: {
            marginLeft: 4,
            marginRight: 0
        }
    }
  }:{});
});