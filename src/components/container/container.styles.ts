import BASE_THEME  from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmContainerStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-container';
export const DEFAULT_STYLES: WmContainerStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);