import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLottieStyles = BaseStyles & {
    content: AllStyle,
};

export const DEFAULT_CLASS = 'app-lottie';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmLottieStyles>({
        root: {},
        text: {},
        content: {
            height: 64,
            width: '100%'
        }
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});