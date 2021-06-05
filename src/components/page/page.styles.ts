import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';

import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPageStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-page';
export const DEFAULT_STYLES: WmPageStyles = {
    root: {
        flex: 1
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);