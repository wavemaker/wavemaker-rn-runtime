import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTabpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tabpane';
export const DEFAULT_STYLES: WmTabpaneStyles = defineStyles({
    root: {
        backgroundColor: ThemeVariables.tabContentBgColor,
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);