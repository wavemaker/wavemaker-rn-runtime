import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../icon/icon.styles';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';

export type WmButtonStyles = BaseStyles & {
  content: AllStyle,
  badge: AllStyle,
  icon: WmIconStyles,
  skeleton: WmSkeletonStyles
};

export const DEFAULT_CLASS = 'app-button';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmButtonStyles = defineStyles<WmButtonStyles>({
      root: {
          minHeight: 40,
          borderRadius: 32,
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: 24,
          paddingRight: 24,
          alignSelf: 'flex-start',
          rippleColor: themeVariables.rippleColor,
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      },
      text: {
        fontSize: 14,
        fontFamily: themeVariables.baseFont,
        fontWeight: '500',
        textAlign: 'center',
        textTransform: 'capitalize',
      },
      badge: {
        backgroundColor: themeVariables.buttonBadgeBackgroundColor,
        color: themeVariables.buttonBadgeTextColor,
        alignSelf: 'flex-end',
        position: 'relative',
        bottom: 60 ,
        marginRight: 18,
        borderWidth: 1,
        borderStyle: 'solid',
      },
      icon: {
        root : {
          alignSelf: 'auto',
          paddingLeft: -8,
          paddingRight: -8
        },
        text: {
          paddingRight: themeVariables.buttonTextPadding,
          fontSize: 16
        }
      } as WmIconStyles,
      skeleton: {
        root: {
          width: 96,
          height: 48,
          borderRadius: 4
        }
      } as WmSkeletonStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-disabled', '', {
    root : {
      opacity: 0.5
    }
  });

  const getButtonStyles = (bgColor: string, color: string, borderColor = bgColor) => {
    return {
      root: {
        borderWidth: 1,
        borderColor: borderColor,
        borderStyle: 'solid',
        backgroundColor: bgColor
      },
      text: {
        color: color
      },
      badge: {
        backgroundColor: color,
        color: bgColor,
        borderColor: bgColor
      },
      icon: {
        text: {
          color: color
        }
      }
    } as WmButtonStyles;
  }

  const linkBtnStyle = getButtonStyles(themeVariables.buttonLinkColor, themeVariables.buttonLinkTextColor );
const buttonWithOnlyLabel = getButtonStyles(themeVariables.buttonLinkColor, themeVariables.buttonLinkTextColor );

  linkBtnStyle.root.paddingVertical = 4;
  linkBtnStyle.text.textDecorationColor = themeVariables.buttonLinkTextColor;
  linkBtnStyle.text.textDecorationLine = 'underline';
  linkBtnStyle.text.textDecorationStyle = 'solid';

  addStyle('btn-default', '', getButtonStyles(themeVariables.buttonDefaultColor, themeVariables.buttonDefaultTextColor, themeVariables.buttonBorderColor));
  addStyle('btn-info', '', getButtonStyles(themeVariables.buttonInfoColor, themeVariables.buttonInfoTextColor));
  addStyle('btn-primary', '', getButtonStyles(themeVariables.buttonPrimaryColor, themeVariables.buttonPrimaryTextColor));
  addStyle('btn-secondary', '', getButtonStyles(themeVariables.buttonSecondaryColor, themeVariables.buttonSecondaryTextColor, themeVariables.buttonSecondaryTextColor));
  addStyle('btn-danger', '', getButtonStyles(themeVariables.buttonDangerColor, themeVariables.buttonDangerTextColor));
  addStyle('btn-success', '', getButtonStyles(themeVariables.buttonSuccessColor, themeVariables.buttonSuccessTextColor));
  addStyle('btn-warning', '', getButtonStyles(themeVariables.buttonWarningColor, themeVariables.buttonWarningTextColor));
  addStyle('btn-link', '', linkBtnStyle);
  addStyle('btn-only-label', '', buttonWithOnlyLabel);
  addStyle('btn-dark', '', getButtonStyles(themeVariables.buttonDarkColor, themeVariables.buttonDarkTextColor));
  addStyle('btn-light', '', getButtonStyles(themeVariables.buttonLightColor, themeVariables.buttonLightTextColor));
  addStyle('fab-btn', 'btn-primary', {
    root : {
      ...BASE_THEME.getStyle('elevate2').root,
      position: 'fixed' as any,
      bottom: 160,
      right: 48,
      width: 56,
      height: 56,
      borderRadius: 56,
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      marginLeft: 0,
      marginRight: 0
    },
    icon: {
      icon: {
        fontSize: 24
      }
    } as WmIconStyles
  } as WmButtonStyles);
  addStyle('mini-fab-btn', 'fab-btn', {
    root : {
      width: 40,
      height: 40
    }
  } as WmButtonStyles);
});
