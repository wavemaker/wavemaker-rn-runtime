import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle, Platform } from 'react-native';

export type WmDatetimeStyles = BaseStyles & {
    focused: AllStyle,
    container: AllStyle,
    placeholderText: TextStyle,
    invalid: AllStyle,
    clearIcon: WmIconStyles,
    calendarIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-datetime';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmDatetimeStyles = defineStyles({
        root: {
            padding: 12,
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
                fontWeight: 'bold'
            }
        } as WmIconStyles
    }) as WmDatetimeStyles;

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
});