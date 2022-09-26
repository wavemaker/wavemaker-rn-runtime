import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmTabheaderStyles = BaseStyles & {
    activeIndicator: ViewStyle,
    header: ViewStyle,
    headerIcon: WmIconStyles,
    headerText: TextStyle,
    activeHeader: ViewStyle,
    activeHeaderIcon: WmIconStyles,
    activeHeaderText: TextStyle
};

export const DEFAULT_CLASS = 'app-tabheader';
export const DEFAULT_STYLES: WmTabheaderStyles = defineStyles({
    root: {
        flexDirection: 'row',
        minWidth: '100%',
        overflow: 'visible',
        backgroundColor: ThemeVariables.tabHeaderBgColor,
    },
    text: {},
    header: {
        backgroundColor: ThemeVariables.tabHeaderBgColor,
        paddingHorizontal: 12,
        paddingVertical: 12,
        minWidth: 80,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerIcon: {
        text: {
            color: ThemeVariables.tabHeaderIconColor
        }
    } as WmIconStyles,
    headerText: {
        color: ThemeVariables.tabHeaderTextColor,
        overflow: 'visible',
        fontFamily: ThemeVariables.baseFont,
        fontWeight: 'bold',
        fontSize: 16,
        textTransform: 'capitalize'
    },
    activeHeader: {
        backgroundColor: ThemeVariables.tabActiveHeaderBgColor
    },
    activeIndicator: {
        backgroundColor: ThemeVariables.tabActiveIndicatorBgColor,
        width: 100,
        height: 4,
        marginTop: -4
    },
    activeHeaderIcon: {
        text: {
            color: ThemeVariables.tabActiveHeaderIconColor
        }
    } as WmIconStyles,
    activeHeaderText: {
        color: ThemeVariables.tabActiveHeaderTextColor 
    }
} as WmTabheaderStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);