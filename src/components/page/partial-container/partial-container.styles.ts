import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPartialContainerStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-partial-container';
export const DEFAULT_STYLES: WmPartialContainerStyles = defineStyles({
    root: {
        width: '100%',
        height: '100%'
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);