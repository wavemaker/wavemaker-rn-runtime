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
  searchInput: AllStyle;
  clearButton: WmButtonStyles;
  searchButton: WmButtonStyles;
  searchWrapper: AllStyle;
  searchInputWrapper: AllStyle;
};

export const DEFAULT_CLASS = 'app-search';
export const DEFAULT_STYLES: WmSearchStyles = {
    root: {
    },
    text: {},
    searchInput: {
      height: 38,
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      width: '100%'
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
    searchWrapper: {
      flexDirection: 'row',
      flex: 1
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    clearButton: {
      root: {
        left: -20,
        alignItems: 'center',
        justifyContent: 'center'
      }
    } as WmButtonStyles,
    searchButton: {
      root: {
        left: -20,
        alignItems: 'center',
        justifyContent: 'center'
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