import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmListTemplateStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-list-template';
export const DEFAULT_STYLES: WmListTemplateStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);