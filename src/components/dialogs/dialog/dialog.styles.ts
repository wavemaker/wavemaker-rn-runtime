import { ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmButtonStyles } from '../../basic/button/button.styles';

export type WmDialogStyles = BaseStyles & {
    modal: ViewStyle,
    modalContent: ViewStyle,
    icon: WmIconStyles,
    closeBtn: WmButtonStyles
};

export const DEFAULT_CLASS = 'app-dialog';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmDialogStyles = defineStyles<WmDialogStyles>({
        root: {
            minWidth: 320,
            width: '90%',
            maxHeight: themeVariables.maxModalHeight,
            backgroundColor: themeVariables.dialogBackgroundColor,
            borderRadius: 6,
            padding: 16
        },
        text: {},
        modal: {},
        modalContent: {
            width: undefined
        },
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
            borderColor: themeVariables.dialogBorderColor
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
                    color: themeVariables.dialogCloseIconColor,
                    fontSize: 16
                }
            }
        } as WmButtonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});