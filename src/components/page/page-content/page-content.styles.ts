import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPageContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-page-content';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPageContentStyles = defineStyles({
        root: {
            padding: 8,
            backgroundColor: themeVariables.pageContentBgColor,
            minHeight: '100%'
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});