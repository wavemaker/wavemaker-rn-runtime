import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmDialogcontentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-dialogcontent';
export const DEFAULT_STYLES: WmDialogcontentStyles = {
    root: {
        padding: 16
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);