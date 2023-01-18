import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmDialogcontentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-dialogcontent';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmDialogcontentStyles = defineStyles({
        root: {
            padding: 16,
            minHeight: 80
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});