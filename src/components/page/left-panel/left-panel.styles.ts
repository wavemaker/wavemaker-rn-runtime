import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLeftPanelStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-left-panel';
export const DEFAULT_STYLES: WmLeftPanelStyles = {
    root: {
        minHeight: '100%'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);