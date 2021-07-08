import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTabpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tabpane';
export const DEFAULT_STYLES: WmTabpaneStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);