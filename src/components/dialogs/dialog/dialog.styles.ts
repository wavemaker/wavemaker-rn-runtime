import { Dimensions, StatusBar, ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmButtonStyles } from '@wavemaker/app-rn-runtime/components/basic/button/button.styles';

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
            paddingTop: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            elevation: 6,
            width: '90%',
            backgroundColor: themeVariables.dialogBackgroundColor,
            borderRadius: 28,
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
                fontFamily: themeVariables.baseFont,
                fontSize: 24,
                fontWeight: '400',
                color : themeVariables.dialogLabelColor,
            },
            icon: {
                fontSize: 24,
                color: themeVariables.dialogIconColor
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
            alignItems: 'center',
            paddingBottom: 16,
        },
        closeBtn: {
            root: {
                alignSelf: 'flex-end',
                backgroundColor: 'transparent',
                borderRadius: 8,
                paddingRight: 8,
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 8,
                minHeight: 0,
                marginBottom: 22,
                rippleColor: themeVariables.transparent
            },
            icon : {
                root: {
                    alignItems: 'center',
                },
                icon: {
                    paddingRight: 0
                },
                text: {
                    color: themeVariables.dialogCloseIconColor,
                    fontSize: 14
                }
            }
        } as WmButtonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});