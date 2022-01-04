import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
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
export const DEFAULT_STYLES: WmTabbarStyles = defineStyles<WmTabbarStyles>({
    root: {},
    text: {},
    menu: {
        flexDirection: 'row',
        backgroundColor: ThemeVariables.tabbarBackgroundColor,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    modalContent: {},
    moreMenu: {
        width: '100%',
        flexDirection: 'column-reverse',
        justifyContent: 'flex-end',
        backgroundColor: ThemeVariables.tabbarBackgroundColor,
        shadowColor: '#000000',
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
        height: 92,
        opacity: 0.4
    },
    activeTabItem: {
        opacity: 1
    },
    tabIcon: {
        root: {
            alignSelf: 'center',
            paddingBottom: 32,
            height: '100%',
            borderBottomColor: ThemeVariables.tabbarIconColor,
            borderBottomWidth: 0
        },
        icon: {
            fontSize: 36,
            color:  ThemeVariables.tabbarIconColor
        }
    } as WmIconStyles,
    activeTabIcon: {
        root: {
            borderBottomWidth: 4
        }
    } as WmIconStyles,
    tabLabel: {
        fontSize: 14,
        fontWeight: '500',
        color:  ThemeVariables.tabbarIconColor,
        textAlign: 'center',
        fontFamily: ThemeVariables.baseFont,
        marginTop: -32
    },
    activeTabLabel: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
