import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmDialogcontentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-dialogcontent';
export const DEFAULT_STYLES: WmDialogcontentStyles = defineStyles({
    root: {
        padding: 16,
        flex: 1,
        minHeight: 80
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);