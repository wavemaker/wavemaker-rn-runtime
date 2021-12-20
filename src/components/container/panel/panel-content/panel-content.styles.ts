import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmPanelContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-panel-content';
export const DEFAULT_STYLES: WmPanelContentStyles = defineStyles({
    root: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderTopWidth: 0,
        borderColor: ThemeVariables.panelHeaderBgColor,
        padding: 8
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);