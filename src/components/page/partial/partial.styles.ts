import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-partial';
export const DEFAULT_STYLES = {
    container: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);