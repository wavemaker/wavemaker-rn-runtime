import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-webview';
export const DEFAULT_STYLES = {
    container : {
        flex: 1
    },
    input: {
        height: 64,
        fontSize: 16
    },
    webview: {
      height: 600,
      flex: 1
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);