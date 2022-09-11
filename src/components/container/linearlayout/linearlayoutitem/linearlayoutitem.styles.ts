import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLinearlayoutitemStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-linearlayoutitem';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmLinearlayoutitemStyles = defineStyles({
        root: {},
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});