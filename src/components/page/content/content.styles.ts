import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-content';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmContentStyles = defineStyles({
        root: {
            flex:1
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});