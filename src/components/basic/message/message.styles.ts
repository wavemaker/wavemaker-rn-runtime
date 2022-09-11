import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

export type WmMessageStyles = BaseStyles & {
    message: AllStyle,
    icon: WmIconStyles
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-message';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmMessageStyles = defineStyles({
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
        borderColor = themeVariables.transparent) => {
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

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle('success-dark-message', '', getStyle(
        themeVariables.messageSuccessColor,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
    ));
    addStyle('error-dark-message', '', getStyle(
        themeVariables.messageErrorColor,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
    ));
    addStyle('warning-dark-message', '', getStyle(
        themeVariables.messageWarningColor,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF
    ));
    addStyle('info-dark-message', '', getStyle(
        themeVariables.messageInfoColor,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
    ));
    addStyle('loading-dark-message', '', getStyle(
        themeVariables.messageLoadingColor,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
        themeVariables.defaultColorF,
    ));


    addStyle('success-light-message', '', getStyle(
        themeVariables.defaultColorF,
        themeVariables.defaultColor6,
        themeVariables.messageSuccessColor,
        themeVariables.defaultColor6,
        themeVariables.defaultColor1,
        themeVariables.defaultColorD
    ));
    addStyle('error-light-message', '', getStyle(
        themeVariables.defaultColorF,
        themeVariables.defaultColor6,
        themeVariables.messageErrorColor,
        themeVariables.defaultColor6,
        themeVariables.defaultColor1,
        themeVariables.defaultColorD
    ));
    addStyle('warning-light-message', '', getStyle(
        themeVariables.defaultColorF,
        themeVariables.defaultColor6,
        themeVariables.messageWarningColor,
        themeVariables.defaultColor6,
        themeVariables.defaultColor1,
        themeVariables.defaultColorD
    ));
    addStyle('info-light-message', '', getStyle(
        themeVariables.defaultColorF,
        themeVariables.defaultColor6,
        themeVariables.messageInfoColor,
        themeVariables.defaultColor6,
        themeVariables.defaultColor1,
        themeVariables.defaultColorD
    ));
    addStyle('loading-light-message', '', getStyle(
        themeVariables.defaultColorF,
        themeVariables.defaultColor6,
        themeVariables.messageLoadingColor,
        themeVariables.defaultColor6,
        themeVariables.defaultColor1,
        themeVariables.defaultColorD
    ));
});