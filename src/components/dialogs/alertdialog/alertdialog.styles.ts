import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmDialogStyles } from '../dialog/dialog.styles';
import { WmDialogcontentStyles } from '../dialogcontent/dialogcontent.styles';
import { WmDialogactionsStyles } from '../dialogactions/dialogactions.styles';
import { WmLabelStyles } from '../../basic/label/label.styles';

export type WmAlertdialogStyles = BaseStyles & {
    dialog: WmDialogStyles,
    dialogContent: WmDialogcontentStyles,
    dialogActions: WmDialogactionsStyles,
    okButton: WmButtonStyles,
    message: WmLabelStyles
};

export const DEFAULT_CLASS = 'app-alertdialog';
export const DEFAULT_STYLES: WmAlertdialogStyles = defineStyles({
    root: {},
    text: {},
    dialog: {} as WmDialogStyles,
    dialogContent: {
        root: {
            minHeight: 100
        }
    } as WmDialogactionsStyles,
    dialogActions: {} as WmDialogcontentStyles,
    okButton: {
        root: {
            width: '100%',
            borderRadius: 4
        }
    } as WmButtonStyles,
    message: {} as WmLabelStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);