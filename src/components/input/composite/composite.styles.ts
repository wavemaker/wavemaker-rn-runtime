import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmCompositeStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-composite';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCompositeStyles = defineStyles({
        root: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});