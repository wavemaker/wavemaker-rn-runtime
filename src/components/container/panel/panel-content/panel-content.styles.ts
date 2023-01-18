import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmPanelContentStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-panel-content';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmPanelContentStyles = defineStyles({
        root: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: themeVariables.panelHeaderBgColor
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});