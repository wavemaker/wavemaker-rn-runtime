import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ViewStyle } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmToggleStyles = BaseStyles & {
  handle: ViewStyle,
  skeleton: WmSkeletonStyles,
    checkicon: WmIconStyles,
    uncheckicon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-toggle';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmToggleStyles = defineStyles({
      root: {
        width: 52,
        height: 32,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 18
      },
      text: {},
      handle: {
        width: 16,
        height: 16,
        borderRadius: 18,
        marginLeft : 8,
        marginRight: 0,
        backgroundSize: '100% 100%',
        backgroundPosition: 'center'
      },
      checkicon : {
        root: {},
        text: {
          fontSize: 16
        },
        icon : {
          color: themeVariables.toggleOnColor,
          padding: 0
        }
    } as WmIconStyles,
      uncheckicon : {
        root: {},
        text: {
          fontSize: 16
        },
        icon : {
          color: themeVariables.toggleOffColor,
          padding: 0
        }
    } as WmIconStyles,
      skeleton: {
        root: {
          width: 52,
          height: 32,
          borderRadius: 18,
        }
      } as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-toggle-input-horizontal', '', {
    root: {
      minWidth: 0, 
    },
    text: {}
  } as BaseStyles);
  
  addStyle(DEFAULT_CLASS + '-on', '', {
    root : {
      backgroundColor: themeVariables.toggleOnColor,
    },
    handle: {
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
      backgroundColor: themeVariables.toggleHandleDisableColor,
    }
  } as WmToggleStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        opacity:0.5
      },
      handle: {
        backgroundColor: themeVariables.toggleHandleDisableColor,
        opacity:1
      }
  });
});
