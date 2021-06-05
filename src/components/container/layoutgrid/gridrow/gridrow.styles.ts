import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmGridRowStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-gridrow';
export const DEFAULT_STYLES: WmGridRowStyles = {
    root: {
        flex: 1,
        flexDirection: 'row'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);