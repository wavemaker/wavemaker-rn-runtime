import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmAccordionpaneStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-accordionpane';
export const DEFAULT_STYLES: WmAccordionpaneStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);