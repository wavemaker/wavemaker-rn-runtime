import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmChipsStyles = BaseStyles & {
  chip: AllStyle;
  chipText: AllStyle;
  chipsWrapper: AllStyle;
};

export const DEFAULT_CLASS = 'app-chips';
export const DEFAULT_STYLES: WmChipsStyles = {
    root: {},
    text: {},
    chipsWrapper: {
      flexDirection: 'row'
    },
    chip: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 5,
      marginRight: 5
    },
    chipText: {
        textAlign: 'center'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
