import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../../basic/icon/icon.styles';

export type WmTabbarStyles = BaseStyles & {
    menu: AllStyle,
    modalContent: AllStyle,
    moreMenu: AllStyle,
    moreMenuRow: AllStyle,
    tabItem: AllStyle,
    tabIcon: WmIconStyles,
    tabLabel: AllStyle,
};

export const DEFAULT_CLASS = 'app-tabbar';
export const DEFAULT_STYLES: WmTabbarStyles = {
    root: {},
    text: {},
    menu: {
        flexDirection: 'row',
        backgroundColor: ThemeVariables.tabbarBackgroundColor,
        justifyContent: 'space-around',
        paddingTop: 4,
        paddingBottom: 4
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
        alignItems: 'center',
        minWidth: 60
    },
    tabIcon: {
        root: {
            alignSelf: 'center'
        },
        icon: {
            fontSize: 24,
            color:  ThemeVariables.tabbarIconColor
        }
    } as WmIconStyles,
    tabLabel: {
        fontSize: 12,
        color:  ThemeVariables.tabbarIconColor
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);