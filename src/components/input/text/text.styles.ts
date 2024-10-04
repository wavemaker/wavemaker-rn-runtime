import BASE_THEME, {AllStyle, Theme} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {ColorValue} from "react-native";
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmTextStyles = BaseStyles & {
  invalid: AllStyle;
  focused: AllStyle;
  placeholderText: AllStyle;
  floatingLabel: AllStyle;
  activeFloatingLabel: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-text';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTextStyles = defineStyles({
      root: {
        minHeight: 42,
        paddingTop: 8,
        paddingBottom: 8,
        borderWidth: 1,
        paddingLeft: 16,
        paddingRight: 16,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6,
        fontFamily: themeVariables.baseFont
      },
      text: {
        fontSize: 16
      },
      invalid: {
        borderBottomColor: themeVariables.inputInvalidBorderColor
      },
      focused : {
        borderColor: themeVariables.inputFocusBorderColor,
      },
      placeholderText: {
      color: themeVariables.inputPlaceholderColor
      },
      floatingLabel: {},
      activeFloatingLabel: {},
      skeleton: {
        root: {
          width: '100%',
          height: 16,
          borderRadius: 4
        }
      } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', {
      root:{
        textAlign: 'right'
      }
  });
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    root: {
      minHeight: 48,
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
  });
});