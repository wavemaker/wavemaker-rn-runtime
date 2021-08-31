import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmTabpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-tabpane';
export const DEFAULT_STYLES: WmTabpaneStyles = {
    root: {
        backgroundColor: ThemeVariables.tabContentBgColor,
        flex: 1
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);