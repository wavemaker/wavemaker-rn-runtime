import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-content';
export const DEFAULT_STYLES: WmContentStyles = {
    root: {
        flex:1
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);