import Color from 'color';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmAccordionpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-accordionpane';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmAccordionpaneStyles = defineStyles({
        root: {
            minHeight: 120,
            borderStyle: 'solid',
            borderColor: themeVariables.accordionBorderColor,
            backgroundColor: themeVariables.accordionPaneBgColor,
            padding: 4
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});