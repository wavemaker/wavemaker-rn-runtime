import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmDialogactionsStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-dialogactions';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmDialogactionsStyles = defineStyles({
        root: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderStyle: 'solid',
            borderColor: themeVariables.dialogBorderColor
        },
        text: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});