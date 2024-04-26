import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { TextStyle, ViewStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmTabheaderStyles = BaseStyles & {
    activeIndicator: ViewStyle,
    header: ViewStyle,
    headerIcon: WmIconStyles,
    headerText: TextStyle,
    arrowIndicator: ViewStyle,
    arrowIndicatorDot: ViewStyle,
    activeHeader: ViewStyle,
    activeHeaderIcon: WmIconStyles,
    activeHeaderText: TextStyle,
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-tabheader';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles = {
        root: {
            flexDirection: 'row',
            minWidth: '100%',
            overflow: 'visible',
            backgroundColor: themeVariables.tabHeaderBgColor,
        },
        text: {},
        header: {
            backgroundColor: themeVariables.tabHeaderBgColor,
            paddingTop: 16,
            paddingBottom: 16,
            paddingVertical: 12,
            minWidth: 80,
            minHeight:48,
            flexDirection: 'row',
            justifyContent: 'center',
            flexGrow: 1
        },
        headerIcon: {
            text: {
                color: themeVariables.tabHeaderIconColor
            },
            icon: {
                fontSize : 12
             }
        } as WmIconStyles,
        headerText: {
            color: themeVariables.tabHeaderTextColor,
            overflow: 'visible',
            fontFamily: themeVariables.baseFont,
            fontWeight: '500',
            fontSize: 14,
        },
        activeHeader: {
            backgroundColor: themeVariables.tabActiveHeaderBgColor
        },
        activeIndicator: {
            backgroundColor: themeVariables.tabActiveIndicatorBgColor,
            width: 100,
            height: 2,
            marginTop: -2
        },
        activeHeaderIcon: {
            text: {
                color: themeVariables.tabActiveHeaderIconColor
            }
        } as WmIconStyles,
        activeHeaderText: {
            color: themeVariables.tabActiveHeaderTextColor
        },
        arrowIndicator: {
            display: 'none',
            backgroundImage: '',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        },
        arrowIndicatorDot: {
            display: 'none'
        },
        skeleton: {} as WmSkeletonStyles
    } as WmTabheaderStyles;
    addStyle(DEFAULT_CLASS, '', defaultStyles);
});
