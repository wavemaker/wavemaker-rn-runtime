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
        width: 52,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 18,
      },
      text: {},
      handle: {
        width: 20,
        height: 20,
        borderRadius: 18,
        // backgroundColor: themeVariables.toggleHandleColor,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center'
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-on', '', {
    root : {
      backgroundColor: themeVariables.toggleOnColor,
      justifyContent: 'flex-end',
    },
    handle: {
      width: 24,
      height: 24,
      marginRight:4,
      backgroundColor: themeVariables.toggleHandleColor,
    }
  } as WmToggleStyles);
  addStyle(DEFAULT_CLASS + '-off', '', {
    root : {
      backgroundColor: themeVariables.toggleOffColor,
      borderColor: themeVariables.toggleOffBorderColor,
      borderWidth: 2
    },
    handle: {
      width: 16,
      height: 16,
      marginLeft: 6,
      backgroundColor: themeVariables.toggleHandleDisableColor,
    }
  } as WmToggleStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {}
  });
});
