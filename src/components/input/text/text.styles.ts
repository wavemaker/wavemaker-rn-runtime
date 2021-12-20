import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTextStyles = BaseStyles & {
  invalid: AllStyle
};

export const DEFAULT_CLASS = 'app-text';
export const DEFAULT_STYLES: WmTextStyles = defineStyles({
    root: {
      height: 38,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
      borderRadius: 4,
      fontFamily: ThemeVariables.baseFont
    },
    text: {},
    invalid: {
      borderBottomColor: 'red'
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
