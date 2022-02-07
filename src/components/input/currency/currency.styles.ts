import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import themeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCurrencyStyles = BaseStyles & {
  label: AllStyle;
  invalid: AllStyle;
  placeholderText: AllStyle;
};

export const DEFAULT_CLASS = 'app-currency';
export const DEFAULT_STYLES: WmCurrencyStyles = defineStyles({
    root: {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
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
      fontFamily: ThemeVariables.baseFont,
      fontSize: 16
    },
    invalid: {
      borderBottomColor: ThemeVariables.inputInvalidBorderColor
    },
    placeholderText: {
      color: ThemeVariables.inputPlaceholderColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
});

