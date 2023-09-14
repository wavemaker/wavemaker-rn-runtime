import { TextStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
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
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmChipsStyles = defineStyles({
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
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 4,
        minWidth: 80,
        minHeight: 32,
        borderWidth: 1,
        borderColor: themeVariables.chipDefaultTextColor
      },
      chipLabel : {
        fontSize: 16,
        paddingLeft: 8,
        paddingRight: 12,
        color: themeVariables.chipDefaultTextColor,
        borderColor: themeVariables.chipDefaultTextColor
      },
      activeChip: {
        backgroundColor: themeVariables.chipActiveBgColor,
        borderColor: themeVariables.chipActiveBgColor,
      },
      activeChipLabel: {
        color: themeVariables.chipActiveTextColor
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
          color: themeVariables.chipActiveTextColor,
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

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
    chip: {
      opacity: 0.5
    },
    search: {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
    }
  });
});
