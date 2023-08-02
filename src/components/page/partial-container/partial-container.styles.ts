import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPartialContainerStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-partial-container';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPartialContainerStyles = defineStyles({
        root: {
            width: '100%',
            backgroundColor: themeVariables.pageContentBgColor
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});