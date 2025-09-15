import { TextStyle, ViewStyle } from 'react-native';
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
  activeChip: BaseStyles;
  clearIcon: WmIconStyles;
  doneIcon: WmIconStyles;
  imageStyles: WmPictureStyles;
  skeleton: WmSkeletonStyles;
  leadingIcon:WmIconStyles;
  assistchipLabel:TextStyle;
  inputchipclear: WmIconStyles;
  inputchipLabelwithicon:TextStyle;
  inputchipLabelwithclear:TextStyle;
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
      assistchip : {
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:8,
        paddingRight:16,
      },
      leadingIcon: {
        icon: {
          paddingLeft: 0,
          paddingRight:0,
          fontSize: 18,
          color: 'var(--wm-color-primary)'
          // themeVariables.chipIconColor,
        }
      } as WmIconStyles,
      assistchipLabel : {
        paddingRight: 0,
      },
      inputchipwithicon :{
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:4,
        paddingRight:8
      },
      inputchipclear:{
        icon: {
          paddingRight: 0
        }
      } as WmIconStyles,
      inputchipLabelwithicon:{
        paddingLeft:8,
        paddingRight:8
      },
      inputchipwithclearicon :{
        paddingTop:0,
        paddingBottom:0,
        paddingLeft:12,
        paddingRight:8
      },
      inputchipLabelwithclear:{
        paddingLeft:0,
        paddingRight:8
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
        root: {
          backgroundColor: themeVariables.chipSelectedContainerColor,
          borderColor: themeVariables.chipSelectedOutlineColor,
          borderWidth: 0
        } as ViewStyle,
        text: {
          color: themeVariables.chipActiveTextColor
        } as TextStyle,
      } as BaseStyles,
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
});
