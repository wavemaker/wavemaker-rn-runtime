import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmMessageStyles = BaseStyles & {
    message: AllStyle,
    icon: WmIconStyles
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-message';
export const DEFAULT_STYLES: WmMessageStyles = defineStyles({
    root: {
        flexDirection: 'row',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    message: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center',
        paddingLeft: 16
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        paddingBottom: 4
    },
    text: {
        fontSize: 12
    },
    icon: {
        root: {
            alignItems: 'flex-start',
            fontSize: 20
        }
    } as WmIconStyles,
    closeBtn: {
        root: {
            paddingHorizontal: 0,
            paddingRight: 8,
            alignSelf: 'center'
        },
        icon: {
            text: {
                fontSize: 16
            }
        }
    } as WmButtonStyles
}) as WmMessageStyles;

const getStyle = (bgColor: string, 
    closeBtnColor: string,
    iconcolor: string,
    textcolor: string,
    titleColor: string,
    borderColor = ThemeVariables.transparent) => {
    return {
        root: {
            backgroundColor: bgColor,
            borderColor: borderColor
        },
        message: {
            color: textcolor
        },
        title: {
            color: titleColor
        },
        text: {
            color: textcolor
        },
        icon: {
            root: {
                color: iconcolor
            }
        } as WmIconStyles,
        closeBtn: {
            icon: {
                root : {
                    color: closeBtnColor,
                }
            }
        } as WmButtonStyles
    } as WmMessageStyles;
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('success-dark-message', '', getStyle(
    ThemeVariables.messageSuccessColor,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
));
BASE_THEME.addStyle('error-dark-message', '', getStyle(
    ThemeVariables.messageErrorColor,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
));
BASE_THEME.addStyle('warning-dark-message', '', getStyle(
    ThemeVariables.messageWarningColor,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF
));
BASE_THEME.addStyle('info-dark-message', '', getStyle(
    ThemeVariables.messageInfoColor,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
));
BASE_THEME.addStyle('loading-dark-message', '', getStyle(
    ThemeVariables.messageLoadingColor,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColorF,
));


BASE_THEME.addStyle('success-light-message', '', getStyle(
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColor6,
    ThemeVariables.messageSuccessColor,
    ThemeVariables.defaultColor6,
    ThemeVariables.defaultColor1,
    ThemeVariables.defaultColorD
));
BASE_THEME.addStyle('error-light-message', '', getStyle(
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColor6,
    ThemeVariables.messageErrorColor,
    ThemeVariables.defaultColor6,
    ThemeVariables.defaultColor1,
    ThemeVariables.defaultColorD
));
BASE_THEME.addStyle('warning-light-message', '', getStyle(
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColor6,
    ThemeVariables.messageWarningColor,
    ThemeVariables.defaultColor6,
    ThemeVariables.defaultColor1,
    ThemeVariables.defaultColorD
));
BASE_THEME.addStyle('info-light-message', '', getStyle(
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColor6,
    ThemeVariables.messageInfoColor,
    ThemeVariables.defaultColor6,
    ThemeVariables.defaultColor1,
    ThemeVariables.defaultColorD
));
BASE_THEME.addStyle('loading-light-message', '', getStyle(
    ThemeVariables.defaultColorF,
    ThemeVariables.defaultColor6,
    ThemeVariables.messageLoadingColor,
    ThemeVariables.defaultColor6,
    ThemeVariables.defaultColor1,
    ThemeVariables.defaultColorD
));