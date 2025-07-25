import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle, Platform, ViewStyle } from 'react-native';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmDatetimeStyles = BaseStyles & {
    focused: AllStyle,
    container: AllStyle,
    placeholderText: TextStyle,
    invalid: AllStyle,
    clearIcon: WmIconStyles,
    calendarIcon: WmIconStyles,
    floatingLabel: TextStyle & ViewStyle,
    activeFloatingLabel: AllStyle
    actionWrapper: ViewStyle,
    selectBtn: WmButtonStyles,
    cancelBtn: WmButtonStyles,
    dialog: AllStyle,
    skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-datetime';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmDatetimeStyles = defineStyles({
        root: {
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 6,
            backgroundColor: themeVariables.inputBackgroundColor,
            borderColor: themeVariables.inputBorderColor,
            justifyContent: 'center',
            width: '100%'
        },
        focused: {

        },
        invalid: {
            borderBottomColor: themeVariables.inputInvalidBorderColor
        },
        placeholderText: {
          color: themeVariables.inputPlaceholderColor
        },
        container: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        text: {
            fontSize: 16,
            color: themeVariables.inputTextColor
        },
        calendarIcon: {
            root: {
                alignSelf: 'center'
            },
            icon: {
                fontSize: 24
            }
        },
        clearIcon:  {
            root : {
                alignSelf: 'center',
                justifyContent: 'center',
                marginRight: 4,
                height: 24,
                width: 24,
                borderRadius: 16,
                backgroundColor: themeVariables.inputDisabledBgColor
            },
            icon: {
                fontSize: 16,
                paddingRight: 0,
                fontWeight: 'bold'
            }
        } as WmIconStyles,
        dialog:{
            minWidth: 320,
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            elevation: 6,
            width: '90%',
            maxHeight: themeVariables.maxModalHeight,
            backgroundColor: themeVariables.dialogBackgroundColor,
            borderRadius: 28
        },
        actionWrapper: {
            flexDirection: 'row-reverse', 
            marginRight: 20,
        },
        selectBtn: {
            root:{
                paddingLeft: 12,
                paddingRight: 12,
            }
        },
        cancelBtn: {
            root:{
                paddingLeft: 12,
                paddingRight: 12,
            }
        },
        skeleton: {
            root:{
              height: 16,
              borderRadius: 4,
              marginRight:16,
              width:'80%' 
            },
            icon:{
                width:32,
                height:32,
                borderRadius:4
            }
          } as any as WmSkeletonStyles,
    }) as any as WmDatetimeStyles;

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    
    // Add horizontal form input styles for horizontal form field layouts - positioned early to avoid overriding more specific styles
    addStyle('form-datetime-input-horizontal', '', {
      root: {
        flex: 1,
        minWidth: 0, // Allow shrinking below intrinsic content size if needed
        maxWidth: '100%'  
      },
      text: {}
    } as BaseStyles);
    
    // Timestamp widgets use the datetime component but have their own widget type
    addStyle('form-timestamp-input-horizontal', '', {
      root: {
        width: '100%'
      },
      rootWrapper: {
        width: '70%'
      },
      text: {}
    } as BaseStyles);

    addStyle('form-datetime-input-horizontal', '', {
        root: {
        width: '100%'
        },
        rootWrapper: {
        width: '70%'
        },
        text: {}
    } as BaseStyles);
    
    addStyle(DEFAULT_CLASS + '-disabled', '', {
        root : {
        backgroundColor: themeVariables.inputDisabledBgColor
        }
    });
    addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
        clearIcon: {
        root: {
            marginLeft: 4,
            marginRight: 0
        }
    }
  }:{});
  addStyle(DEFAULT_CLASS + '-with-label', '', {
    root:{
        minHeight: 48,
        paddingVertical: 16
    },
    floatingLabel: {
        position: 'absolute',
        top: 12,
        left: 16,
        fontSize: 14,
        color: themeVariables.floatingLabelColor
    },
    activeFloatingLabel: {
        color: themeVariables.activeFloatingLabelColor
    }
  } as any as WmDatetimeStyles);
});