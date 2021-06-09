import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type BaseNavStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-basenav';
export const DEFAULT_STYLES: BaseNavStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
