import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { WmDatetimeStyles, DEFAULT_CLASS as DATE_TIME_DEFAUlT_CLASS } from '../datetime/datetime.styles';
import { Platform } from 'react-native';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTimeStyles = WmDatetimeStyles;

export const DEFAULT_CLASS = 'app-time';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  addStyle(DEFAULT_CLASS, DATE_TIME_DEFAUlT_CLASS, {});
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-time-input-horizontal', '', {
    root: {
      width: '100%'
    },
    rootWrapper: {
      width: '70%'
    },
    text: {}
  } as BaseStyles);
  
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
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    root:{
      minHeight: 48,
      paddingVertical: 16
    },
    floatingLabel: {
        position: 'absolute',
        top: 12,
        left: 16,
        fontSize: 14,
        color: themeVariables.floatingLabelColor
    },
    activeFloatingLabel: {
        color: themeVariables.activeFloatingLabelColor
    }
  } as any as WmDatetimeStyles);
});