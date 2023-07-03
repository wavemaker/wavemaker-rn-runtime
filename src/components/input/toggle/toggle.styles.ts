import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform } from 'react-native';

export type WmToggleStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-toggle';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmToggleStyles = defineStyles({
      root: {
        width: 36
      },
      text: {
        color: themeVariables.toggleColor
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="android"?{
    root : {
      transform: [{rotateY:'180deg'}]
    }
  }:{});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {}
  });
});
