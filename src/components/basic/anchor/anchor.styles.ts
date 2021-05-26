import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-anchor';

export const DEFAULT_STYLES = {
    root: {
        color: 'blue',
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    text: {
        color: 'blue',
        fontSize: 12,
        textDecoration: 'underline'
    },
    badge: {
        backgroundColor: '#f50057',
        color: '#ffffff',
        alignSelf: 'flexStart',
        position: 'relative',
        top: -12,
        left: -6
    },
    icon: {
        text: {
            color: 'blue',
            fontSize: 14
        }
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getColordLinkStyles = (color: string) => {
    return {
        root: {
            color: color
        },
        text: {
            color: color
        },
        icon: {
            text: {
                color: color
            }
        }
    };
};

BASE_THEME.addStyle('link-primary', DEFAULT_CLASS, getColordLinkStyles('#0d6efd'));
BASE_THEME.addStyle('link-secondary', DEFAULT_CLASS, getColordLinkStyles('#565e64'));
BASE_THEME.addStyle('link-success', DEFAULT_CLASS, getColordLinkStyles('#198754'));
BASE_THEME.addStyle('link-danger', DEFAULT_CLASS, getColordLinkStyles('#b02a37'));
BASE_THEME.addStyle('link-warning', DEFAULT_CLASS, getColordLinkStyles('#ffc107'));
BASE_THEME.addStyle('link-info', DEFAULT_CLASS, getColordLinkStyles('#0dcaf0'));
BASE_THEME.addStyle('link-light', DEFAULT_CLASS, getColordLinkStyles('#f8f9fa'));
BASE_THEME.addStyle('link-dark', DEFAULT_CLASS, getColordLinkStyles('#212529'));