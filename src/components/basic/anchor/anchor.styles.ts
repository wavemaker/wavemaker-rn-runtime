import Color from 'color';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export type WmAnchorStyles = BaseStyles & {
    badge: AllStyle,
    icon: WmIconStyles
    skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-anchor';

BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmAnchorStyles = defineStyles({
        root: {
            color: themeVariables.linkDefaultColor,
            flexDirection: 'row',
            alignItems: 'center',
            overflow: 'visible'
        },
        text: {
            paddingLeft: 8,
            paddingRight: 8,
            color: themeVariables.linkDefaultColor,
            fontSize: 18, 
            textDecorationLine: 'underline',
        },
        badge: {
            backgroundColor: Color(themeVariables.linkDefaultColor).fade(0.8).rgb().toString(),
            color: themeVariables.linkDefaultColor,
            alignSelf: 'flex-start',
            marginTop: -12,
            marginLeft: 0,
            fontWeight: 'bold'
        },
        icon: {
            root : {
                alignSelf: 'center'
            },
            text: {
                fontSize: 16,
                paddingRight: themeVariables.anchorTextPadding,
                color: themeVariables.linkDefaultColor
            }
        } as WmIconStyles,
        skeleton: {
            root: {
                width: '100%',
                height: 20,
                borderRadius: 4
            }
        } as any as WmSkeletonStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle(DEFAULT_CLASS + '-rtl', '', {
        text: {
            paddingRight: 8
        }
    });

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
            },
            badge: {
                backgroundColor: Color(color).fade(0.8).rgb().toString(),
                color: color,
            }
        } as WmAnchorStyles;
    };

    addStyle('link-primary', '', getLinkStyles(themeVariables.linkPrimaryColor));
    addStyle('link-secondary', '', getLinkStyles(themeVariables.linkSecondaryColor));
    addStyle('link-success', '', getLinkStyles(themeVariables.linkSuccessColor));
    addStyle('link-danger', '', getLinkStyles(themeVariables.linkDangerColor));
    addStyle('link-warning', '', getLinkStyles(themeVariables.linkWarningColor));
    addStyle('link-info', '', getLinkStyles(themeVariables.linkInfoColor));
    addStyle('link-light', '', getLinkStyles(themeVariables.linkLightColor));
    addStyle('link-dark', '', getLinkStyles(themeVariables.linkDarkColor));
});
