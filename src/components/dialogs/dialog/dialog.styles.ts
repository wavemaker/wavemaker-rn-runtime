import { Dimensions, ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmButtonStyles } from '../../basic/button/button.styles';

export type WmDialogStyles = BaseStyles & {
    modal: ViewStyle,
    modalContent: ViewStyle,
    icon: WmIconStyles,
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-dialog';
export const DEFAULT_STYLES: WmDialogStyles = defineStyles<WmDialogStyles>({
    root: {
        maxWidth: 360,
        width: '90%',
        maxHeight: Dimensions.get('window').height - 32,
        backgroundColor: ThemeVariables.dialogBackgroundColor,
        borderRadius: 6,
        padding: 16
    },
    text: {},
    modal: {},
    modalContent: {},
    icon: {
        root: {
            alignSelf: 'center',
        },
        text: {
            fontSize: 20,
            fontWeight: 'bold'
        },
        icon: {
            fontSize: 24,
        }
    } as WmIconStyles,
    header: {
        flexDirection: 'row',
        borderStyle: 'solid',
        borderColor: ThemeVariables.dialogBorderColor
    },
    headerLabel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
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
                color: ThemeVariables.dialogCloseIconColor,
                fontSize: 16
            }
        }
    } as WmButtonStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);