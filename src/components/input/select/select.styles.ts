import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { Platform } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmSelectStyles = BaseStyles & {
  arrowButton: WmButtonStyles;
  modal: AllStyle;
  modalContent: AllStyle;
  checkIcon: WmIconStyles;
  selectItem: AllStyle;
  lastSelectItem: AllStyle,
  selectItemText: AllStyle;
  selectedItem: AllStyle;
  selectedItemText: AllStyle;
  dropDownContent: AllStyle;
  disabledText: AllStyle;
  placeholderText: AllStyle;
  invalid: AllStyle;
  skeleton: WmSkeletonStyles;
  arrowButtonSkeleton: WmSkeletonStyles;
  textSkeleton: WmSkeletonStyles;
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
      alignItems: 'center',
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
      text: {
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
      backgroundColor: themeVariables.inputBackgroundColor,
      borderRadius: 6,
      position: 'absolute',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: themeVariables.inputBorderColor,
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
    selectedItem: {},
    selectedItemText:{},
    placeholderText: {
      color: themeVariables.inputPlaceholderColor
    },
    dropDownContent: {},
    arrowButton: {
      root: {
        borderRadius: 0,
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 6,
        paddingRight: 0,
        minHeight: 0,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
      }
    } as WmButtonStyles,
    skeleton: {
      root:{
        minWidth: 0,
        width:120,
        height: 16,
        borderRadius: 4,
        marginRight:8,
        padding:0
      }
    } as any as WmSkeletonStyles,
    dropdown: {
      backgroundColor: themeVariables.popoverBackgroundColor,
      maxHeight: 240,
      borderRadius:6
  },
    arrowButtonSkeleton: {
      root: {
        width: 24,
        height: 24,
        borderRadius: 12  
      }
    } as any as WmSkeletonStyles,
    textSkeleton: {
      root: {
        width: 100,
        height: 16,
        borderRadius: 8  
      }
    } as any as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-select-input-horizontal', '', {
    root: {
      flex: 1,
      minWidth: 0,
      maxWidth: '100%'
    },
    text: {}
  } as BaseStyles);
  
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle('select-dropdown', '', {
    modal: {
        backgroundColor: 'transparent',
    },
    dropdown: {
        backgroundColor: themeVariables.transparent
    },
    modalContent: {
        borderRadius: 6,
        boxShadow: `4px 4px 8px rgba(0, 0, 0, 0.27)`
    }
});
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    text:{
      textAlign:'right',
    }
    ,selectItemText : {
      textAlign : 'right'
    }
  }:{
    text:{
      textAlign:'left',
    },
    selectItemText : {
      textAlign : 'left'
    }
  });

  addStyle('form-widget-selectform-select-input-horizontal', '', {
    rootWrapper: {
      width: '70%'
    },
    root: {
      width: '100%'
    },
    text: {},
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: undefined,
      display: 'flex'
    },
  } as BaseStyles);
});
