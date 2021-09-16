import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmSearchStyles = BaseStyles & {
  modal: AllStyle;
  modalContent: AllStyle;
  searchItem: AllStyle;
  dropDownContent: AllStyle;
  searchItemText: AllStyle;
  clearButton: WmButtonStyles;
  searchButton: WmButtonStyles;
  searchInputWrapper: AllStyle;
};

export const DEFAULT_CLASS = 'app-search';
export const DEFAULT_STYLES: WmSearchStyles = {
    root: {
      flexDirection: 'row',
      flex: 1
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
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
      borderColor: ThemeVariables.searchBorderColor,
      backgroundColor: ThemeVariables.searchDropdownBackgroundColor,
    },
    modal: {
      backgroundColor: 'transperant'
    },
    modalContent: {
      backgroundColor: ThemeVariables.searchDropdownBackgroundColor,
      position: 'absolute',
      shadowColor: 'rgba(0, 0, 0, 0.175)',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 1.5,
      shadowRadius: 12,
      elevation: 5
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
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderBottomColor: ThemeVariables.searchItemBorderColor,
      padding: 8,
      flexDirection: 'row',
      color: ThemeVariables.searchItemTextColor
    },
    searchItemText: {
      fontSize: 16,
      paddingLeft: 8
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
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
