import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import themeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCurrencyStyles = BaseStyles & {
  label: AllStyle,
  invalid: AllStyle
};

export const DEFAULT_CLASS = 'app-currency';
export const DEFAULT_STYLES: WmCurrencyStyles = {
    root: {
      height: 40,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
      borderRadius: 4,
      flexDirection: 'row'
    },
    text: {},
    input : {
      height: '100%',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      borderBottomRightRadius: 4,
      borderBottomLeftRadius: 4,
      flex: 1
    },
    label: {
      height: '100%',
      backgroundColor: themeVariables.inputBorderColor,
      textAlignVertical: 'center',
      padding: 8,
      paddingLeft: 12,
      paddingRight: 12,
    },
    invalid: {
      borderBottomColor: 'red'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
