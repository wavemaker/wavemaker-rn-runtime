import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-anchor';

export const DEFAULT_STYLES = {
    root: {
        color: ThemeVariables.linkPrimaryColor,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    text: {
        color: ThemeVariables.linkPrimaryColor,
        fontSize: 12,
        textDecoration: 'underline'
    },
    badge: {
        backgroundColor: ThemeVariables.linkBadgeBackgroundColor,
        color: ThemeVariables.linkBadgeTextColor,
        alignSelf: 'flexStart',
        position: 'relative',
        top: -12,
        left: -6
    },
    icon: {
        text: {
            color: ThemeVariables.linkPrimaryColor,
            fontSize: 14
        }
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getLinkStyles = (color: string) => {
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

BASE_THEME.addStyle('link-primary', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkPrimaryColor));
BASE_THEME.addStyle('link-secondary', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkSecondaryColor));
BASE_THEME.addStyle('link-success', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkSuccessColor));
BASE_THEME.addStyle('link-danger', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkDangerColor));
BASE_THEME.addStyle('link-warning', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkWarningColor));
BASE_THEME.addStyle('link-info', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkInfoColor));
BASE_THEME.addStyle('link-light', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkLightColor));
BASE_THEME.addStyle('link-dark', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkDarkColor));