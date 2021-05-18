import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-anchor';
export const DEFAULT_STYLES = {
    root: {
        color: 'blue'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);