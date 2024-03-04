import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle, Platform, ViewStyle } from 'react-native';

export type WmDatetimeStyles = BaseStyles & {
    focused: AllStyle,
    container: AllStyle,
    placeholderText: TextStyle,
    invalid: AllStyle,
    clearIcon: WmIconStyles,
    calendarIcon: WmIconStyles,
    floatingLabel: ViewStyle,
    activeFloatingLabel: AllStyle
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
        } as WmIconStyles
    }) as any as WmDatetimeStyles;

    addStyle(DEFAULT_CLASS, '', defaultStyles);
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