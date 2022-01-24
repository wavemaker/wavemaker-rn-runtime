import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmSearchStyles } from '@wavemaker/app-rn-runtime/components/basic/search/search.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmChipsStyles = BaseStyles & {
  chip: AllStyle;
  chipText: AllStyle;
  chipsWrapper: AllStyle;
  search: WmSearchStyles;
  searchContainer: AllStyle;
  activeChip: AllStyle;
  defaultChip: AllStyle;
  clearIcon: WmIconStyles;
  doneIcon: WmIconStyles;
};

export const DEFAULT_CLASS = 'app-chips';
export const DEFAULT_STYLES: WmChipsStyles = defineStyles({
    root: {
      flexWrap: 'wrap',
    },
    text: {},
    chipsWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    chip: {
      margin: 2,
      backgroundColor: 'white',
      borderRadius: 500,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      minWidth: 100
    },
    activeChip: {
      backgroundColor: ThemeVariables.chipActiveBgColor,
      color: ThemeVariables.chipActiveTextColor
    },
    defaultChip: {
      backgroundColor: ThemeVariables.chipDefaultBgColor,
      color: ThemeVariables.chipDefaultTextColor
    },
    chipText: {
        textAlign: 'center'
    },
    searchContainer: {
      width: '100%',
      flexDirection: 'column'
    },
    search: {
      text: {
        borderRightWidth: 1,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
      }
    } as WmSearchStyles,
    doneIcon: {
      icon: {
        paddingRight: 5
      }
    } as WmIconStyles,
    clearIcon: {
      icon: {
        paddingLeft: 5
      }
    } as WmIconStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
