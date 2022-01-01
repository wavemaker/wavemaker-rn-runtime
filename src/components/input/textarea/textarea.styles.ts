import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTextareaStyles = BaseStyles & {
  invalid: AllStyle
};

export const DEFAULT_CLASS = 'app-textarea';
export const DEFAULT_STYLES: WmTextareaStyles = defineStyles({
    root: {
      padding:12,
      borderWidth:1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
      borderRadius: 6,
      fontFamily: ThemeVariables.baseFont
    },
    text: {
      fontSize: 16
    },
    invalid: {
      borderBottomColor: 'red'
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
