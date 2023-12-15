import BASE_THEME, {AllStyle, Theme} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {ColorValue} from "react-native";
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

export type WmTextStyles = BaseStyles & {
  invalid: AllStyle;
  placeholderText: AllStyle;
  floatingText: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-text';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTextStyles = defineStyles({
      root: {
        minHeight: 56,
        // paddingTop: 12,
        // paddingBottom: 8,
        borderBottomWidth: 1,
        paddingLeft: 16,
        paddingRight: 16,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        borderBottomColor: themeVariables.defaultColor,
        fontFamily: themeVariables.baseFont
      },
      text: {
        fontSize: 16
      },
      invalid: {
        borderBottomColor: themeVariables.inputInvalidBorderColor
      },
      placeholderText: {
      color: themeVariables.inputPlaceholderColor
      },
      floatingText: {
        position: 'absolute',
        paddingTop: 19,
        marginBottom: 4,
        marginHorizontal: 10,
        paddingHorizontal: 5,
        fontSize: 14,
        zIndex: 1,
      },
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
  })
});