import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPageContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-page-content';
export const DEFAULT_STYLES: WmPageContentStyles = defineStyles({
    root: {
        padding: 8,
        backgroundColor: ThemeVariables.pageContentBgColor,
        minHeight: '100%'
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);