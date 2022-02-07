import { TextStyle } from 'react-native';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

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
};

export const DEFAULT_CLASS = 'app-search';
export const DEFAULT_STYLES: WmSearchStyles = defineStyles({
    root: {
      flexDirection: 'row'
    },
    text: {
      height: 48,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      width: '100%',
      borderWidth: 1,
      borderRightWidth: 0,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
      borderColor: ThemeVariables.searchBorderColor,
      backgroundColor: ThemeVariables.searchDropdownBackgroundColor,
    },
    focusedText : {
      borderBottomLeftRadius: 0,
    },
    modal: {
      backgroundColor: 'transperant',
      height: '100%'
    },
    modalContent: {
      backgroundColor: ThemeVariables.searchDropdownBackgroundColor,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
      position: 'absolute',
      borderWidth: 1,
      borderTopWidth: 0,
      borderStyle: 'solid',
      borderColor: ThemeVariables.searchBorderColor,
      maxHeight: 200
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
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: ThemeVariables.searchButtonColor,
        height: 48
      },
      icon: {
        icon: {
          fontSize: 24,
          color: ThemeVariables.searchButtonTextColor,
        }
      }
    } as WmButtonStyles,
    searchItem: {
      width: '100%',
      marginBottom: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomColor: ThemeVariables.searchItemBorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      color: ThemeVariables.searchItemTextColor
    },
    searchItemText: {
      fontSize: 16,
      paddingLeft: 8,
      fontFamily: ThemeVariables.baseFont
    },
    dataCompleteItem: {
        root: {
          backgroundColor: ThemeVariables.searchDataCompleteItemBgColor,
          justifyContent: 'center',
          padding: 8
        },
        text: {
          fontSize: 12,
          textDecorationLine: 'none',
          color: ThemeVariables.searchItemTextColor
        }
    },
    placeholderText: {
      color: ThemeVariables.inputPlaceholderColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    text : {
      backgroundColor: ThemeVariables.inputDisabledBgColor
    }
});

BASE_THEME.addStyle('app-autocomplete', '', {
  text: {
    borderRightWidth: 1,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  }
} as WmSearchStyles);
