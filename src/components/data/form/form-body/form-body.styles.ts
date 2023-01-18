import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmFormBodyStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-body';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmFormBodyStyles = defineStyles({
        root: {
            flex: 1
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});