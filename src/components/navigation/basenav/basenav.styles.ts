import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type BaseNavStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-basenav';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: BaseNavStyles = defineStyles({
        root: {},
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});