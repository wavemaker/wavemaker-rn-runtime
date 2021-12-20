import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCardContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-card-content';
export const DEFAULT_STYLES: WmCardContentStyles = defineStyles({
    root: {
        backgroundColor: ThemeVariables.cardContentBgColor,
        padding: 8
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);