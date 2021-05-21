import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-tabbar';
export const DEFAULT_STYLES = {
    root: {},
    menu: {
        flexDirection: 'row'
    },
    extras: {
        flexDirection: 'row',
        alignItems: 'flexEnd'
    },
    tabItem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },
    tabIcon: {
        root: {
            alignSelf: 'center'
        },
        icon: {
            fontSize: 24
        }
    },
    tabLabel: {
        fontSize: 12
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);