import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle } from 'react-native';

export type WmFormFieldStyles = BaseStyles & {
    errorMsg: TextStyle
};

export const DEFAULT_CLASS = 'app-form-field';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmFormFieldStyles = defineStyles({
        root: {
            marginBottom: 24
        },
        text: {},
        errorMsg: {
            color: 'red',
            fontSize: 13,
            paddingTop: 6,
            fontFamily: themeVariables.baseFont
        }
    });
    addStyle('form-label', '', {
        root : {
            paddingBottom: 5
        },
        text: {
            color: themeVariables.defaultTextColor,
            fontSize: themeVariables.heading5FontSize
        }
    } as BaseStyles);
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});
