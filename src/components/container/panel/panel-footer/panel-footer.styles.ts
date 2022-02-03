import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmPanelFooterStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-panel-footer';
export const DEFAULT_STYLES: WmPanelFooterStyles = defineStyles({
    root: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: ThemeVariables.panelFooterColor,
        minHeight: 64,
        marginTop: 8,
        padding: 8,
        borderRadius: 6
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);