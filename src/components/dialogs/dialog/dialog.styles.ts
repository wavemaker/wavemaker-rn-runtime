import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '../../basic/button/button.styles';

export type WmDialogStyles = BaseStyles & {
    icon: WmIconStyles,
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-dialog';
export const DEFAULT_STYLES: WmDialogStyles = {
    root: {
        maxWidth: 360,
        width: '90%',
        backgroundColor: ThemeVariables.dialogBackgroundColor,
        borderRadius: 8
    },
    text: {},
    icon: {
        root: {
            alignSelf: 'center',
            padding: 8
        }
    } as WmIconStyles,
    header: {
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: ThemeVariables.dialogBorderColor
    },
    headerLabel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeBtn: {
        root: {
            alignSelf: 'flex-end',
            backgroundColor: 'transparent',
            padding: 8
        },
        icon : {
            root: {
                alignItems: 'center'
            },
            text: {
                color: '#aaa'
            }
        }
    } as WmButtonStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);