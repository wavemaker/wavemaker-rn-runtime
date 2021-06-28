import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLinearlayoutStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-linearlayout';
export const DEFAULT_STYLES: WmLinearlayoutStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);