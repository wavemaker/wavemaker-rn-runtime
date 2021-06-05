import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPartialContainerStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-partial-container';
export const DEFAULT_STYLES: WmPartialContainerStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);