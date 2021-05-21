import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES = {
    root: {},
    leftnavIcon: {
        borderRadius: 0,
        root: {
            alignItems: 'flex-start',
            marginTop: -5,
            marginLeft: -5
        },
        icon: {
            fontSize: 36,
            color: '#ffffff'
        }
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);