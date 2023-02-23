import { TextStyle, ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmNetworkInfoToasterStyles = BaseStyles & {
    action: ViewStyle,
    actionSeparator: TextStyle
    actionText: TextStyle
};

export const DEFAULT_CLASS = 'app-network-info-toaster';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = defineStyles<WmNetworkInfoToasterStyles>({
        root: {
            width: '100%',
            paddingVertical: 16,
            paddingHorizontal: 16,
            backgroundColor: themeVariables.networkToastBgColor,
            flexDirection: 'row',
            alignItems: 'center'
        },
        text: {
            color: themeVariables.networkToastTextColor,
            fontSize: 16,
            flex: 1
        },
        action: {
            padding: 4
        },
        actionSeparator : {
            color: themeVariables.networkToastActionSeparatorColor,
            fontSize: 16,
            marginHorizontal: 2
        },
        actionText: {
            color: themeVariables.networkToastActionTextColor
        }
    });
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});