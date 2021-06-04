import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-tabbar';
export const DEFAULT_STYLES = {
    root: {},
    menu: {
        flexDirection: 'row',
        backgroundColor: ThemeVariables.tabbarBackgroundColor,
        justifyContent: 'space-around',
        paddingTop: 4,
        paddingBottom: 4
    },
    modalContent: {
        width: '100%'
    },
    moreMenu: {
        flexDirection: 'column-reverse',
        justifyContent: 'flexEnd',
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
    },
    tabLabel: {
        fontSize: 12,
        color:  ThemeVariables.tabbarIconColor
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);