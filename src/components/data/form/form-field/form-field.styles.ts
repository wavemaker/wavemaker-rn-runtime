import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { TextStyle } from 'react-native';

export type WmFormFieldStyles = BaseStyles & {
    errorMsg: TextStyle
};

export const DEFAULT_CLASS = 'app-form-field';
export const DEFAULT_STYLES: WmFormFieldStyles = defineStyles({
    root: {},
    text: {},
    errorMsg: {
        color: 'red',
        fontSize: 11,
        fontFamily: ThemeVariables.baseFont
    }
});
BASE_THEME.addStyle('form-label', '', {
    root : {
        paddingBottom: 5
    },
    text: {
        fontSize: ThemeVariables.heading5FontSize
    }
} as BaseStyles);
BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);