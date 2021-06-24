import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmRadiosetStyles = BaseStyles & {
  groupHeaderTitle: AllStyle;
  radioHead: AllStyle;
  radio: AllStyle;
  radioLabel: AllStyle;
};

export const DEFAULT_CLASS = 'app-radioset';
export const DEFAULT_STYLES: WmRadiosetStyles = {
    root: {},
    text: {},
    groupHeaderTitle: {
      backgroundColor: ThemeVariables.groupHeaderBackgroundColor,
      fontSize: 16,
      paddingLeft: 8,
      paddingRight: 8,
      lineHeight: 40,
    } as AllStyle,
    radioHead: {
      flexDirection: 'row',
      alignContent: 'center',
    } as AllStyle,
    radio: {
       flex: 1
    } as AllStyle,
    radioLabel: {
        flex: 4,
        alignSelf: 'center',
    } as AllStyle
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
