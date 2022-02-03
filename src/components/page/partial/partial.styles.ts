import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPartialStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-partial';
export const DEFAULT_STYLES: WmPartialStyles = defineStyles({
    root: {
        width: "100%"
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);