import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-webview';
export const DEFAULT_STYLES = {
    container : {
        flex: 1,
        minHeight: 100
    },
    webview: {
      flex: 1
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);