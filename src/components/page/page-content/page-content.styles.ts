import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPageContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-page-content';
export const DEFAULT_STYLES: WmPageContentStyles = {
    root: {
        padding: 8
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);