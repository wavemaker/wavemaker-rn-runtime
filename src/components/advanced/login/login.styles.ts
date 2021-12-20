import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

export type WmLoginStyles = BaseStyles & {
    errorMsgStyles: AllStyle,
    formStyles: AllStyle
};

export const DEFAULT_CLASS = 'app-login';
export const DEFAULT_STYLES: WmLoginStyles = defineStyles({
    root: {},
    text: {},
    errorMsgStyles: { 
        color: ThemeVariables.loginErrorMsgColor, 
        fontSize: 14, 
        backgroundColor: ThemeVariables.loginErrorMsgBgColor , 
        borderColor: ThemeVariables.loginErrorMsgBorderColor, 
        padding: 12,
        fontFamily: ThemeVariables.baseFont
    },
    formStyles: {
        padding: 35
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const paddingStyle = {
    padding: 5
};
BASE_THEME.addStyle('app-login-username', DEFAULT_CLASS, {
    root: paddingStyle
});

BASE_THEME.addStyle('app-login-password', DEFAULT_CLASS, {
    root: paddingStyle
});