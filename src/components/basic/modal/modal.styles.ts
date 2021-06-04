import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-modal';
export const DEFAULT_STYLES = {
    root: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0)',
        alignSelf: 'center',
    },
    content: {
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        alignSelf: 'center'
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);