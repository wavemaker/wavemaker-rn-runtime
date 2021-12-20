import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';

import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPageStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-page';
export const DEFAULT_STYLES: WmPageStyles = defineStyles({
    root: {
        flexDirection: 'column',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute'
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);