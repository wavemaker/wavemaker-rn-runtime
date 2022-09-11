import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import { WmDialogStyles } from '../dialog/dialog.styles';
import { WmDialogcontentStyles } from '../dialogcontent/dialogcontent.styles';
import { WmDialogactionsStyles } from '../dialogactions/dialogactions.styles';
import { WmLabelStyles } from '../../basic/label/label.styles';

export type WmConfirmdialogStyles = BaseStyles & {
    dialog: WmDialogStyles,
    dialogContent: WmDialogcontentStyles,
    dialogActions: WmDialogactionsStyles,
    okButton: WmButtonStyles,
    cancelButton: WmButtonStyles,
    message: WmLabelStyles
};

export const DEFAULT_CLASS = 'app-confirmdialog';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmConfirmdialogStyles = defineStyles({
        root: {},
        text: {},
        dialog: {
            icon: {
                icon: {
                    fontSize: 16
                }
            }
        } as WmDialogStyles,
        dialogContent: {
            root: {}
        } as WmDialogcontentStyles,
        dialogActions: {
            root: {
                padding: 0,
                flexDirection: 'row',
            }
        } as WmDialogactionsStyles,
        okButton: {
            root : {
                flex: 1
            },
            text: {
                textTransform: 'capitalize'
            }
        } as WmButtonStyles,
        cancelButton: {
            root : {
                flex: 1,
                marginRight: 8,
            },
            text: {
                textTransform: 'capitalize'
            }
        }  as WmButtonStyles,
        message: {
            text: {
                color: themeVariables.alertMessageColor
            }
        } as WmLabelStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});