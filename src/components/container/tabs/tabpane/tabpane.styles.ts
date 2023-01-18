import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTabpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tabpane';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmTabpaneStyles = defineStyles({
        root: {
            backgroundColor: themeVariables.tabContentBgColor
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});