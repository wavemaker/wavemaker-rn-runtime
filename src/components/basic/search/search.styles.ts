import { Platform, TextStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export type WmSearchStyles = BaseStyles & {
  focusedText: TextStyle,
  modal: AllStyle;
  modalContent: AllStyle;
  searchItem: AllStyle;
  dropDownContent: AllStyle;
  searchItemText: AllStyle;
  clearButton: WmButtonStyles;
  searchButton: WmButtonStyles;
  searchInputWrapper: AllStyle;
  placeholderText: AllStyle;
  invalid: AllStyle;
  skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-search';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmSearchStyles = defineStyles({
      root: {
        flexDirection: 'row',
        borderRadius: 28,
      },
      text: {
        minHeight: 56,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 24,
        paddingRight: 14,
        width: '100%',
        borderWidth: 1,
        borderRightWidth: 0,
        borderTopLeftRadius: 28,
        borderBottomLeftRadius: 28,
        borderColor: themeVariables.searchBorderColor,
        backgroundColor: themeVariables.searchBgContainerColor,
      },
    invalid: {
      borderBottomColor: themeVariables.inputInvalidBorderColor,
    },
      focusedText : {
        borderBottomLeftRadius: 28,
      },
    modal: {
      backgroundColor: themeVariables.transparent,
      height: '100%'
    },
    modalContent: {
      backgroundColor: themeVariables.searchBgContainerColor,
      borderRadius: 6,
      position: 'absolute',
      borderStyle: 'solid',
      borderColor: themeVariables.searchBorderColor,
      width: '90%'
    },
      dropDownContent: {
          width: '100%'
      },
      searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      },
      clearButton: {
        root: {
          marginLeft: -40,
          padding: 0,
          width: 36,
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent'
        }
      } as WmButtonStyles,
      searchButton: {
        root: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 0,
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
          backgroundColor: themeVariables.searchButtonColor,
          height: 56,
          rippleColor: themeVariables.rippleColor
        },
        icon: {
          icon: {
            fontSize: 24,
            color: themeVariables.searchButtonTextColor,
            marginRight: 4
          }
        }
      } as WmButtonStyles,
      searchItem: {
        width: '100%',
        marginBottom: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderBottomColor: themeVariables.searchItemBorderColor,
        flexDirection: 'row',
        alignItems: 'center',
        color: themeVariables.searchItemTextColor
      },
      searchItemText: {
        fontSize: 16,
        paddingLeft: 8,
        fontFamily: themeVariables.baseFont
      },
      dataCompleteItem: {
          root: {
            backgroundColor: themeVariables.searchDataCompleteItemBgColor,
            justifyContent: 'center',
            padding: 8
          },
          text: {
            fontSize: 12,
            textDecorationLine: 'none',
            color: themeVariables.searchItemTextColor
          }
      },
      placeholderText: {
        color: themeVariables.inputPlaceholderColor
      },
      skeleton: {
        root: {
          width: '100%',
          height: '100%',
        }
      } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      text : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });

  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=='android'?{
    text : {
      textAlign: 'right',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    searchButton: {
      root: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
      },
    }
  }:Platform.OS=='web'?{
    text : {
      textAlign: 'right',
      borderWidth: 1,
      borderRightWidth: 1,
      borderLeftWidth: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    searchButton: {
      root: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
      },
    },
    clearButton: {
      root: {
        left: 0,
        position: 'absolute',
        marginLeft: 0
      }
    } as WmButtonStyles,
  }:{
    text : {
      textAlign: 'right',
    }
  });

  addStyle('app-autocomplete', '', {
    text: {
      borderRightWidth: 1,
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    }
  } as WmSearchStyles);
});
