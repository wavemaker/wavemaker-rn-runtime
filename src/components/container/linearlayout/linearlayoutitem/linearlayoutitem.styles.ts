import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLinearlayoutitemStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-linearlayoutitem';
export const DEFAULT_STYLES: WmLinearlayoutitemStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);