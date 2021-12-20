import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
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
export const DEFAULT_STYLES: WmConfirmdialogStyles = defineStyles({
    root: {},
    text: {},
    dialog: {} as WmDialogStyles,
    dialogContent: {
        root: {
            minHeight: 100
        }
    } as WmDialogcontentStyles,
    dialogActions: {
        root: {
            padding: 0,
            flexDirection: 'row'
        }
    } as WmDialogactionsStyles,
    okButton: {
        root : {
            height: '100%',
            width: '50%',
            padding: 16,
            borderWidth: 0,
            borderRadius: 0,
            borderBottomRightRadius: 8
        }
    } as WmButtonStyles,
    cancelButton: {
        root : {
            height: '100%',
            width: '50%',
            paddingTop: 16,
            borderRadius: 0,
            borderBottomLeftRadius: 8,
            borderWidth: 0,
            borderRightWidth: 1,
            borderStyle: 'solid',
            borderColor: ThemeVariables.dialogBorderColor
        }
    }  as WmButtonStyles,
    message: {} as WmLabelStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);