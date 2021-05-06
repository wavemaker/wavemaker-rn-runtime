import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-page-content';
export const DEFAULT_STYLES = {
    container: {
        flex: 1
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);