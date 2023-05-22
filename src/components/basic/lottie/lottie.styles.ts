import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLottieStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-lottie';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmLottieStyles>({
        root: {},
        text: {}
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});