import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { Platform } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmSelectStyles = BaseStyles & {
  arrowButton: WmButtonStyles;
  modal: AllStyle;
  modalContent: AllStyle;
  checkIcon: WmIconStyles;
  selectItem: AllStyle;
  lastSelectItem: AllStyle,
  selectItemText: AllStyle;
  dropDownContent: AllStyle;
  disabledText: AllStyle;
  placeholderText: AllStyle;
  invalid: AllStyle;
};

export const DEFAULT_CLASS = 'app-select';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmSelectStyles = defineStyles({
    root: {
      flexDirection: 'row',
      padding: 12,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeVariables.inputBorderColor,
      backgroundColor: themeVariables.inputBackgroundColor,
      borderRadius: 6,
      minWidth: 160,
      alignItems: 'center'
    },
    invalid: {
      borderBottomColor: themeVariables.inputInvalidBorderColor
    },
    text: {
      fontSize: 16,
      fontFamily: themeVariables.baseFont,
      flex: 1,
      color: themeVariables.inputTextColor
    },
    checkIcon: {
      icon: {
        fontSize: 24,
        color: themeVariables.primaryColor
      }
    } as WmIconStyles,
    disabledText: {
      backgroundColor : themeVariables.inputDisabledBgColor
    },
    modal: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      height: '100%'
    },
    modalContent: {
      backgroundColor: themeVariables.selectDropdownBackgroundColor,
      borderRadius: 6,
      position: 'absolute',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeVariables.selectBorderColor,
      width: '90%'
    },
    selectItem: {
      width: '100%',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: themeVariables.selecttemBorderColor,
      flexDirection: 'row',
      alignItems: 'center'
    },
    lastSelectItem: {
      borderBottomWidth: 0
    },
    selectItemText: {
      fontSize: 16,
      fontFamily: themeVariables.baseFont,
      color: themeVariables.selectItemTextColor,
      flex: 1
    },
    placeholderText: {
      color: themeVariables.inputPlaceholderColor
    },
    dropDownContent: {},
    arrowButton: {
      root: {
        padding: 0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }
    } as WmButtonStyles,
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    text:{
      textAlign:'right',
    }
  }:{
    text:{
      textAlign:'left',
    }
  });
});
