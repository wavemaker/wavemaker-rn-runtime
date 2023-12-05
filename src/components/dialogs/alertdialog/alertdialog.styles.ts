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
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmAlertdialogStyles = defineStyles({
        root: {},
        text: {},
        dialog: {} as WmDialogStyles,
        dialogContent: {
            root: {}
        } as WmDialogactionsStyles,
        dialogActions: {} as WmDialogcontentStyles,
        okButton: {
            root: {
               border: 'none',
               marginLeft: 4
            },
            text : {
              fontsize: 16
            }
        } as any as WmButtonStyles,
        message: {
            text: {
                fontFamily: themeVariables.baseFont,
                fontSize: 14,
                fontWeight: '400',
                color: themeVariables.dialogSupportingTextColor
            }
        } as WmLabelStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});