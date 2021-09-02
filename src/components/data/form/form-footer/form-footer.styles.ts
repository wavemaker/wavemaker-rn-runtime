import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmFormFooterStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-footer';
export const DEFAULT_STYLES: WmFormFooterStyles = {
    root: {
        flexDirection: 'row',
        padding: 8,
        justifyContent: 'flex-end',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderColor: ThemeVariables.formBorderColor
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);