import { TextStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmSearchStyles } from '@wavemaker/app-rn-runtime/components/basic/search/search.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';

export type WmChipsStyles = BaseStyles & {
  chip: AllStyle;
  chipLabel: TextStyle;
  chipsWrapper: AllStyle;
  search: WmSearchStyles;
  searchContainer: AllStyle;
  activeChip: AllStyle;
  activeChipLabel: TextStyle;
  clearIcon: WmIconStyles;
  doneIcon: WmIconStyles;
  imageStyles: WmPictureStyles
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
      paddingVertical: 4,
      paddingHorizontal: 4,
      minWidth: 80,
      minHeight: 40,
      borderWidth: 1,
      borderColor: ThemeVariables.chipDefaultTextColor
    },
    chipLabel : {
      fontSize: 16,
      paddingHorizontal: 8,
      color: ThemeVariables.chipDefaultTextColor,
      borderColor: ThemeVariables.chipDefaultTextColor
    },
    activeChip: {
      backgroundColor: ThemeVariables.chipActiveBgColor,
      borderColor: ThemeVariables.chipActiveBgColor,
    },
    activeChipLabel: {
      color: ThemeVariables.chipActiveTextColor
    },
    searchContainer: {
      width: '100%',
      flexDirection: 'column'
    },
    search: {
      root: {
        marginBottom: 8
      },
      text: {
        borderRightWidth: 1,
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
      }
    } as WmSearchStyles,
    doneIcon: {
      icon: {
        paddingLeft: 8
      }
    } as WmIconStyles,
    clearIcon: {
      icon: {
        color: ThemeVariables.chipActiveTextColor,
        paddingRight: 8
      }
    } as WmIconStyles,
    imageStyles: {
      root: {
        width: 32,
        height: 32
      }
    } as WmPictureStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
  chip: {
    opacity: 0.5
  },
  search: {
    root : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
  }
});

