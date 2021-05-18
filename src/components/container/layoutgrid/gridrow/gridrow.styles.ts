import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-gridrow';
export const DEFAULT_STYLES = {
    root: {
        flex: 1,
        flexDirection: 'row'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);