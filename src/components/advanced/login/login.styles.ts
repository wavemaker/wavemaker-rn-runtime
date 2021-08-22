import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLoginStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-login';
export const DEFAULT_STYLES: WmLoginStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);


const borderStyle = {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e0e0e0'
};
BASE_THEME.addStyle('app-login-username', DEFAULT_CLASS, {
    root: borderStyle
});

BASE_THEME.addStyle('app-login-password', DEFAULT_CLASS, {
    root: borderStyle
});