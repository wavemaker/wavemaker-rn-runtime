import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform } from 'react-native';

export type WmCurrencyStyles = BaseStyles & {
  label: AllStyle;
  invalid: AllStyle;
  placeholderText: AllStyle;
};

export const DEFAULT_CLASS = 'app-currency';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmCurrencyStyles = defineStyles({
      root: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6,
        flexDirection: 'row'
      },
      text: {
        fontSize: 16
      },
      input : {
        height: '100%',
        padding: 12,
        flex: 1,
        borderWidth: 1,
        borderColor: themeVariables.transparent,
        borderStyle: 'solid'
      },
      labelWrapper: {
        height: '100%',
        backgroundColor: themeVariables.primaryColor,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        width: 48,
        padding: 12,
      },
      label: {
        color: themeVariables.primaryContrastColor,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: themeVariables.baseFont,
        fontSize: 16
      },
      invalid: {
        borderBottomColor: themeVariables.inputInvalidBorderColor
      },
      placeholderText: {
        color: themeVariables.inputPlaceholderColor
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    labelWrapper:{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    }
  }:{});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
});