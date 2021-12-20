import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmDialogactionsStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-dialogactions';
export const DEFAULT_STYLES: WmDialogactionsStyles = defineStyles({
    root: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: ThemeVariables.dialogBorderColor
    },
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);