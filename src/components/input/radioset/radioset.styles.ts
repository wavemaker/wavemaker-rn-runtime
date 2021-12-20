import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmRadiosetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  radioHead: AllStyle;
  radioLabel: AllStyle;
};

export const DEFAULT_CLASS = 'app-radioset';
export const DEFAULT_STYLES: WmRadiosetStyles = defineStyles({
    root: {
      color: ThemeVariables.checkedColor
    },
    text: {},
    groupHeaderTitle: {
      backgroundColor: ThemeVariables.groupHeaderBackgroundColor,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      lineHeight: 40,
      fontFamily: ThemeVariables.baseFont
    } as AllStyle,
    radioHead: {
      flexDirection: 'row',
      alignContent: 'center',
    } as AllStyle,
    radioLabel: {
        alignSelf: 'center',
        fontFamily: ThemeVariables.baseFont
    } as AllStyle
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
