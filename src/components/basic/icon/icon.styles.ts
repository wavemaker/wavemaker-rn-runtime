import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-icon';
export const DEFAULT_STYLES = {
    root: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center'
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);