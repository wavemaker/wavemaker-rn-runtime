import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmAccordionpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-accordionpane';
export const DEFAULT_STYLES: WmAccordionpaneStyles = {
    root: {
        minHeight: 120,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderStyle: 'solid',
        borderColor: ThemeVariables.accordionBorderColor,
        padding: 4
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);