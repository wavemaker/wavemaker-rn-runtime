import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmToggleStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-toggle';
export const DEFAULT_STYLES: WmToggleStyles = defineStyles({
    root: {
      width: 36
    },
    text: {
      color: ThemeVariables.toggleColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {}
});
