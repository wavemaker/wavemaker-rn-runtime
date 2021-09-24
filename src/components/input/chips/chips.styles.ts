import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmSearchStyles } from '@wavemaker/app-rn-runtime/components/basic/search/search.styles';

export type WmChipsStyles = BaseStyles & {
  chip: AllStyle;
  chipText: AllStyle;
  chipsWrapper: AllStyle;
  search: WmSearchStyles;
};

export const DEFAULT_CLASS = 'app-chips';
export const DEFAULT_STYLES: WmChipsStyles = {
    root: {
      flexWrap: 'wrap',
    },
    text: {},
    chipsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2
    },
    chipText: {
        textAlign: 'center'
    },
    searchContainer: {
      width: 180
    },
    search: {
      root: {
        alignItems: "center"
      },
      text: {
        height: 28,
        borderRightWidth: 1,
      }
    } as WmSearchStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
