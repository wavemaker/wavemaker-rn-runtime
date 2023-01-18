import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmTabbarStyles = BaseStyles & {
    menu: AllStyle,
    modalContent: AllStyle,
    moreMenu: AllStyle,
    moreMenuRow: AllStyle,
    tabItem: AllStyle,
    activeTabItem: AllStyle,
    tabIcon: WmIconStyles,
    activeTabIcon: WmIconStyles,
    tabLabel: AllStyle,
    activeTabLabel: AllStyle
};

export const DEFAULT_CLASS = 'app-tabbar';
    BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmTabbarStyles = defineStyles<WmTabbarStyles>({
        root: {
            height: 88
        },
        text: {},
        menu: {
            height: '100%',
            flexDirection: 'row',
            backgroundColor: themeVariables.tabbarBackgroundColor,
            justifyContent: 'space-around',
            alignItems: 'flex-end',
        },
        modalContent: {},
        moreMenu: {
            width: '100%',
            flexDirection: 'column-reverse',
            justifyContent: 'flex-end',
            backgroundColor: themeVariables.tabbarBackgroundColor,
            ...BASE_THEME.getStyle('elevate1').root,
            shadowOffset: {
                width: 0,
                height: -6
            },
            shadowOpacity: 0.3,
            shadowRadius: 6
        },
        moreMenuRow: {
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            width: '100%',
            paddingTop: 4,
            paddingBottom: 4
        },
        tabItem: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 60,
            opacity: 0.4
        },
        activeTabItem: {
            opacity: 1
        },
        tabIcon: {
            root: {
                alignSelf: 'center',
                paddingBottom: 32,
                borderBottomColor: themeVariables.transparent,
                borderBottomWidth: 4
            },
            icon: {
                fontSize: 36,
                color:  themeVariables.tabbarIconColor
            }
        } as WmIconStyles,
        activeTabIcon: {
            root: {
                borderBottomColor: themeVariables.tabbarIconColor,
            }
        } as WmIconStyles,
        tabLabel: {
            fontSize: 14,
            fontWeight: '500',
            color:  themeVariables.tabbarIconColor,
            textAlign: 'center',
            fontFamily: themeVariables.baseFont,
            marginTop: -32,
            paddingBottom: 14
        },
        activeTabLabel: {}
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
});