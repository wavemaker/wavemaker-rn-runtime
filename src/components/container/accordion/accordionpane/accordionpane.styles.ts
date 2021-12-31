import Color from 'color';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmAccordionpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-accordionpane';
export const DEFAULT_STYLES: WmAccordionpaneStyles = defineStyles({
    root: {
        minHeight: 120,
        borderStyle: 'solid',
        borderColor: ThemeVariables.accordionBorderColor,
        backgroundColor: Color(ThemeVariables.accordionActiveHeaderBgColor).fade(0.9).rgb().toString(),
        padding: 4
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);