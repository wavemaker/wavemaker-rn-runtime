import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPanelFooterStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-panel-footer';
export const DEFAULT_STYLES: WmPanelFooterStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);