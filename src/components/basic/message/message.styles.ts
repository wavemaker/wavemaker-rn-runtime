import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmMessageStyles = BaseStyles & {
    message: AllStyle,
    icon: WmIconStyles
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-message';
export const DEFAULT_STYLES: WmMessageStyles = {
    root: {},
    text: {}
} as WmMessageStyles;

const getStyle = (bgColor: string, closeBtnColor: string, iconcolor: string, textcolor: string) => {
    return {
        root: {
            flexDirection: 'row',
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            paddingRight: 8,
            backgroundColor: bgColor,
            borderRadius: 2
        },
        message: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 16
        },
        text: {
            fontSize: 12,
            color: textcolor
        },
        icon: {
            root: {
                height: '100%',
                alignItems: 'flex-start',
                fontSize: 20,
                color: iconcolor
            }
        } as WmIconStyles,
        closeBtn: {
            root: {
                alignItems: 'flex-start',
                paddingTop: 2,
                paddingBottom: 0
            },
            icon: {
                root : {
                    color: closeBtnColor,
                    fontSize: 16
                }
            }
        } as WmButtonStyles
    } as WmMessageStyles;
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('success-message', DEFAULT_CLASS, getStyle(
    ThemeVariables.messageSuccessBackgroundColor,
    ThemeVariables.messageSuccessCloseBtnColor,
    ThemeVariables.messageSuccessIconColor,
    ThemeVariables.messageSuccessTextColor
));
BASE_THEME.addStyle('error-message', DEFAULT_CLASS, getStyle(
    ThemeVariables.messageErrorBackgroundColor,
    ThemeVariables.messageErrorCloseBtnColor,
    ThemeVariables.messageErrorIconColor,
    ThemeVariables.messageErrorTextColor
));
BASE_THEME.addStyle('warning-message', DEFAULT_CLASS, getStyle(
    ThemeVariables.messageWarningBackgroundColor,
    ThemeVariables.messageWarningCloseBtnColor,
    ThemeVariables.messageWarningIconColor,
    ThemeVariables.messageWarningTextColor
));
BASE_THEME.addStyle('info-message', DEFAULT_CLASS, getStyle(
    ThemeVariables.messageInfoBackgroundColor,
    ThemeVariables.messageInfoCloseBtnColor,
    ThemeVariables.messageInfoIconColor,
    ThemeVariables.messageInfoTextColor
));
BASE_THEME.addStyle('loading-message', DEFAULT_CLASS, getStyle(
    ThemeVariables.messageLoadingBackgroundColor,
    ThemeVariables.messageLoadingCloseBtnColor,
    ThemeVariables.messageLoadingIconColor,
    ThemeVariables.messageLoadingTextColor
));