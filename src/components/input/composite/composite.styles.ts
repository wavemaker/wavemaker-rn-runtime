import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCompositeStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-composite';
export const DEFAULT_STYLES: WmCompositeStyles = defineStyles({
    root: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);