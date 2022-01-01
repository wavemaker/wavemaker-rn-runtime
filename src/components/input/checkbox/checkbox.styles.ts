import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCheckboxStyles = BaseStyles & {
  checkboxLabel: AllStyle
};

export const DEFAULT_CLASS = 'app-checkbox';
export const DEFAULT_STYLES: WmCheckboxStyles = defineStyles({
    root: {
      flexDirection: 'row',
      alignContent: 'center',
    },
    text: {
      color: ThemeVariables.checkedColor
    },
    checkboxLabel: {
      alignSelf: 'center',
      fontFamily: ThemeVariables.baseFont,
      fontSize: 16,
      color: ThemeVariables.labelDefaultColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
