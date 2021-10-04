import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmAnchorStyles = BaseStyles & {
    badge: AllStyle,
    icon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-anchor';

export const DEFAULT_STYLES: WmAnchorStyles = {
    root: {
        color: ThemeVariables.linkPrimaryColor,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        paddingLeft: 8,
        color: ThemeVariables.linkPrimaryColor,
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    badge: {
        backgroundColor: ThemeVariables.linkBadgeBackgroundColor,
        color: ThemeVariables.linkBadgeTextColor,
        alignSelf: 'flex-start',
        marginTop: -12,
        marginLeft: -6
    },
    icon: {
        root : {
            alignSelf: 'center'
        },
        text: {
            paddingRight: ThemeVariables.anchorTextPadding,
            color: ThemeVariables.linkPrimaryColor
        }
    } as WmIconStyles
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
    } as WmAnchorStyles;
};

BASE_THEME.addStyle('link-primary', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkPrimaryColor));
BASE_THEME.addStyle('link-secondary', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkSecondaryColor));
BASE_THEME.addStyle('link-success', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkSuccessColor));
BASE_THEME.addStyle('link-danger', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkDangerColor));
BASE_THEME.addStyle('link-warning', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkWarningColor));
BASE_THEME.addStyle('link-info', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkInfoColor));
BASE_THEME.addStyle('link-light', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkLightColor));
BASE_THEME.addStyle('link-dark', DEFAULT_CLASS, getLinkStyles(ThemeVariables.linkDarkColor));
