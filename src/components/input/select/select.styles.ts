import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmSelectStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-select';
export const DEFAULT_STYLES: WmSelectStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
