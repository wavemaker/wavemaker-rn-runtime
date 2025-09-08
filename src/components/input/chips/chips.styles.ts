import { TextStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSearchStyles } from '@wavemaker/app-rn-runtime/components/basic/search/search.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';
import { WmSkeletonStyles } from '../../basic/skeleton/skeleton.styles';

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
  imageStyles: WmPictureStyles;
  skeleton: WmSkeletonStyles;
  leftIcon: WmIconStyles;
  rightIcon: WmIconStyles;
  activeLeftIcon: WmIconStyles;
  activeRightIcon: WmIconStyles;
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
        backgroundColor: themeVariables.chipContainerColor,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        paddingHorizontal: 4,
        minWidth: 80,
        minHeight: 32,
        borderWidth: 1,
        borderColor: themeVariables.chipborderColor,
        elevation: 1
      },
      chipLabel : {
        fontSize: 14,
        paddingLeft: 8,
        fontFamily: themeVariables.baseFont,
        fontWeight: '500',
        paddingRight: 12,
        color: themeVariables.chipDefaultTextColor,
        borderColor: themeVariables.chipborderColor
      },
      activeChip: {
        backgroundColor: themeVariables.chipSelectedContainerColor, 
        borderColor: themeVariables.chipSelectedOutlineColor,
        borderWidth: 0
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
          paddingLeft: 8,
          fontSize: 18,
          color: themeVariables.chipIconColor,
        }
      } as WmIconStyles,
      clearIcon: {
        icon: {
          color: themeVariables.chipIconColor,
          paddingRight: 8,
          fontSize: 18
        }
      } as WmIconStyles,
      imageStyles: {
        root: {
          width: 32,
          height: 32
        }
      } as WmPictureStyles,
      skeleton: {
        root:{
          width: 80,
          borderRadius: 8,
          padding:4,
          minHeight: 32,
        }
      } as any as WmSkeletonStyles,
      leftIcon: {
        icon: {
          marginRight: 0,
          fontSize: 16,
          color: themeVariables.chipDefaultTextColor,
        }
      } as WmIconStyles,
      rightIcon: {
        icon: {
          marginLeft: 0,
          fontSize: 16,
          color: themeVariables.chipDefaultTextColor,
        }
      } as WmIconStyles,
      activeLeftIcon: {
        icon: {
          marginRight: 0,
          fontSize: 16,
          color: themeVariables.chipActiveTextColor,
        }
      } as WmIconStyles,
      activeRightIcon: {
        icon: {
          marginLeft: 0,
          fontSize: 16,
          color: themeVariables.chipActiveTextColor,
        }
      } as WmIconStyles,
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-chips-input-horizontal', '', {
    root: {
      flex: 1,
      minWidth: 0, // Allow shrinking below intrinsic content size if needed
      maxWidth: '100%' // Prevent overflow
    },
    text: {}
  } as BaseStyles);
  
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
  addStyle('app-chips-left-badge', '', {
    text: {
      fontSize: 14,
      marginRight: 0,
      marginTop: 2,
      fontFamily: themeVariables.baseFont,
      fontWeight: '500',
      color: themeVariables.chipDefaultTextColor,
    }
  } as BaseStyles);

  addStyle('app-chips-right-badge', '', {
    text: {
      fontSize: 14,
      marginLeft: 0,
      marginTop: 2,
      fontFamily: themeVariables.baseFont,
      fontWeight: '500',
      color: themeVariables.chipDefaultTextColor,
    }
  } as BaseStyles);

  addStyle('app-chips-active-left-badge', '', {
    text: {
      color: themeVariables.chipActiveTextColor,
      marginTop: 2
    }
  } as BaseStyles);

  addStyle('app-chips-active-right-badge', '', {
    text: {
      color: themeVariables.chipActiveTextColor,
      marginTop: 2
    }
  } as BaseStyles);
});
