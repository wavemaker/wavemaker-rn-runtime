import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmGridColumnStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-gridcolumn';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmGridColumnStyles = defineStyles({
        root: {},
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);

    addStyle('table-cell', '', {});
});
