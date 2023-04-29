import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmVideoStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-video';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmVideoStyles>({
        root: {},
        text: {}
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});