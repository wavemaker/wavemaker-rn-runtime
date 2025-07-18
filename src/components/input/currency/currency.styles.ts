import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { Platform } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmCurrencyStyles = BaseStyles & {
  label: AllStyle;
  invalid: AllStyle;
  focused: AllStyle;
  floatingLabel: AllStyle;
  activeFloatingLabel: AllStyle;
  placeholderText: AllStyle;
  skeleton: WmSkeletonStyles;
  skeletonLabel: WmSkeletonStyles;
  skeletonTextInputWrapper:  WmSkeletonStyles;
  skeletonLabelWrapper:  WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-currency';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmCurrencyStyles = defineStyles({
      root: {
        minHeight: 42,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.inputBorderColor,
        backgroundColor: themeVariables.inputBackgroundColor,
        borderRadius: 6,
        flexDirection: 'row'
      },
      text: {
        fontSize: 16
      },
      input : {
        minHeight: 42,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        flex: 1,
        borderWidth: 1,
        borderColor: themeVariables.transparent,
        borderStyle: 'solid'
      },
      labelWrapper: {
        minHeight: 42,
        backgroundColor: themeVariables.primaryColor,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        width: 48,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        display: 'flex',
        justifyContent: 'center'
      },
      label: {
        marginVertical: 0.7,
        color: themeVariables.primaryContrastColor,
        textAlignVertical: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: themeVariables.baseFont,
        fontSize: 16
      },
      invalid: {
        borderBottomColor: themeVariables.inputInvalidBorderColor
      },
      focused : {
        borderColor: themeVariables.inputFocusBorderColor,
      },
      placeholderText: {
        color: themeVariables.inputPlaceholderColor
      },
      skeleton: {
        root:{
          borderRadius: 6,
          paddingLeft: 16,
          paddingRight: 16,
          minHeight: 42,
          paddingTop: 8,
          paddingBottom: 8,
          width: '100%',
          height: 40
        },
      } as any as WmSkeletonStyles,
      skeletonLabel: {
        root: {
          width:20,
          height:28,
          borderRadius:4,
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
        }
      } as any as WmSkeletonStyles,
      skeletonTextInputWrapper: {
        root: {
          width:80,
          height:16,
          borderRadius:4,
          marginLeft:16
        }
      } as any as WmSkeletonStyles,
      skeletonLabelWrapper: {
        root: {
          minHeight:42,
          width:'100%',
          borderWidth:0,
        }
      } as any as WmSkeletonStyles,
      floatingLabel: {},
      activeFloatingLabel: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  
  // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
  addStyle('form-currency-input-horizontal', '', {
    root: {
      flex: 1,
      minWidth: 0, // Allow shrinking below intrinsic content size if needed
      maxWidth: '100%' // Prevent overflow
    },
    text: {}
  } as BaseStyles);
  
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    labelWrapper:{
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    }
  }:{});
  addStyle(DEFAULT_CLASS + '-disabled', '', {
      root : {
        backgroundColor: themeVariables.inputDisabledBgColor
      }
  });
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    root: {
      minHeight: 48
    },
    floatingLabel: {
      position: 'absolute',
      top: 12,
      left: 16,
      fontSize: 14,
      textAlign: 'left',
      color: themeVariables.floatingLabelColor
    },
    activeFloatingLabel: {
      color: themeVariables.activeFloatingLabelColor
    }
  });
});