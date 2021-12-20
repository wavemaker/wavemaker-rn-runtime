import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmFormBodyStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-body';
export const DEFAULT_STYLES: WmFormBodyStyles = defineStyles({
    root: {
        flex: 1
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);