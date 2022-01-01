import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmNumberStyles = BaseStyles & {
  invalid: AllStyle
};

export const DEFAULT_CLASS = 'app-number';
export const DEFAULT_STYLES: WmNumberStyles = defineStyles<WmNumberStyles>({
    root: {
      padding: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.inputBorderColor,
      backgroundColor: ThemeVariables.inputBackgroundColor,
      borderRadius: 6
    },
    text: {
      fontSize: 16,
      textAlign: 'left'
    },
    invalid: {
      borderBottomColor: ThemeVariables.inputInvalidBorderColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
