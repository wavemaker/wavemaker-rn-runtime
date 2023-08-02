import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform, ViewStyle } from 'react-native';
import Color from 'color';

export type WmToggleStyles = BaseStyles & {
  handle: ViewStyle
};

export const DEFAULT_CLASS = 'app-toggle';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmToggleStyles = defineStyles({
      root: {
        width: 36,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1
      },
      text: {},
      handle: {
        width: 18,
        height: 18,
        borderRadius: 18,
        backgroundColor: themeVariables.toggleHandleColor,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center'
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-on', '', {
    root : {
      backgroundColor: themeVariables.toggleOnColor,
      justifyContent: 'flex-end',
      borderColor: themeVariables.toggleOnColor
    }
  } as WmToggleStyles);
  addStyle(DEFAULT_CLASS + '-off', '', {
    root : {
      backgroundColor: themeVariables.toggleOffColor,
      borderColor: themeVariables.toggleOffColor
    }
  } as WmToggleStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {}
  });
});
