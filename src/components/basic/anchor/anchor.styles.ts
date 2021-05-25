import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-anchor';
const textStyles = {
    color: 'blue',
    fontSize: 14
};
export const DEFAULT_STYLES = {
    root: {
        color: 'blue',
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    text: textStyles,
    badge: {
        alignSelf: 'flexStart',
        position: 'relative',
        top: -12,
        left: -6
    },
    icon: {
        text: textStyles
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);