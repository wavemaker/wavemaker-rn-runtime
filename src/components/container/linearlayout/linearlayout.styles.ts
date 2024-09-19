import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLinearlayoutStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-linearlayout';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmLinearlayoutStyles = defineStyles({
        root: {},
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});