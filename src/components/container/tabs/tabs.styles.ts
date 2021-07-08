import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTabsStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tabs';
export const DEFAULT_STYLES: WmTabsStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
