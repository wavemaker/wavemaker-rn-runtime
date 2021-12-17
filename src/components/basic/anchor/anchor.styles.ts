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
        color: ThemeVariables.linkDefaultColor,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        paddingLeft: 8,
        color: ThemeVariables.linkDefaultColor,
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
            color: ThemeVariables.linkDefaultColor
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

BASE_THEME.addStyle('link-primary', '', getLinkStyles(ThemeVariables.linkPrimaryColor));
BASE_THEME.addStyle('link-secondary', '', getLinkStyles(ThemeVariables.linkSecondaryColor));
BASE_THEME.addStyle('link-success', '', getLinkStyles(ThemeVariables.linkSuccessColor));
BASE_THEME.addStyle('link-danger', '', getLinkStyles(ThemeVariables.linkDangerColor));
BASE_THEME.addStyle('link-warning', '', getLinkStyles(ThemeVariables.linkWarningColor));
BASE_THEME.addStyle('link-info', '', getLinkStyles(ThemeVariables.linkInfoColor));
BASE_THEME.addStyle('link-light', '', getLinkStyles(ThemeVariables.linkLightColor));
BASE_THEME.addStyle('link-dark', '', getLinkStyles(ThemeVariables.linkDarkColor));
