import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLoginStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-login';
export const DEFAULT_STYLES: WmLoginStyles = {
    root: {},
    text: {}
};

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