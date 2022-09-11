import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmFormFooterStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-footer';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmFormFooterStyles = defineStyles({
        root: {
            flexDirection: 'row',
            padding: 8,
            justifyContent: 'flex-end',
            borderStyle: 'solid',
            borderTopWidth: 1,
            borderColor: themeVariables.formBorderColor
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});