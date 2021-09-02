import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmFormFieldStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-field';
export const DEFAULT_STYLES: WmFormFieldStyles = {
    root: {},
    text: {}
};
BASE_THEME.addStyle('form-label', '', {
    root : {
        paddingBottom: 5
    },
    text: {
        fontSize: ThemeVariables.heading5FontSize
    }
} as BaseStyles);
BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);