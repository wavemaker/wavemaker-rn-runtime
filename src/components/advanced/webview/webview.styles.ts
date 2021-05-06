import BASE_THEME from '@wavemaker/rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-webview';
export const DEFAULT_STYLES = {
    container : {
        flex: 1,
        minHeight: 100,
        backgroundColor: '#000000',
        alignContent: 'stretch'
    },
    webview: {
      flex: 1,
      alignSelf: 'stretch'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);