import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../icon/icon.styles';

export type WmButtonStyles = BaseStyles & {
  content: AllStyle,
  badge: AllStyle,
  icon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-button';
export const DEFAULT_STYLES: WmButtonStyles = defineStyles<WmButtonStyles>({
    root: {
        padding: 12,
        borderRadius: 6,
        alignSelf: 'flex-start'
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      textTransform: 'capitalize',
      marginHorizontal: 4
    },
    badge: {
      backgroundColor: ThemeVariables.buttonBadgeBackgroundColor,
      color: ThemeVariables.buttonBadgeTextColor,
      alignSelf: 'flex-start',
      position: 'relative',
      top: -16,
      marginLeft: -16,
      borderWidth: 1,
      borderStyle: 'solid'
    },
    icon: {
      root : {
        alignSelf: 'auto'
      },
      text: {
        paddingRight: ThemeVariables.buttonTextPadding,
        fontSize: 16
      }
    } as WmIconStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-disabled', '', {
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

const linkBtnStyle = getButtonStyles(ThemeVariables.buttonLinkColor, ThemeVariables.buttonLinkTextColor);
linkBtnStyle.root.paddingVertical = 4;
linkBtnStyle.text.textDecorationColor = ThemeVariables.buttonLinkTextColor;
linkBtnStyle.text.textDecorationLine = 'underline';
linkBtnStyle.text.textDecorationStyle = 'solid';

BASE_THEME.addStyle('btn-default', '', getButtonStyles(ThemeVariables.buttonDefaultColor, ThemeVariables.buttonDefaultTextColor, ThemeVariables.buttonBorderColor));
BASE_THEME.addStyle('btn-info', '', getButtonStyles(ThemeVariables.buttonInfoColor, ThemeVariables.buttonInfoTextColor));
BASE_THEME.addStyle('btn-primary', '', getButtonStyles(ThemeVariables.buttonPrimaryColor, ThemeVariables.buttonPrimaryTextColor));
BASE_THEME.addStyle('btn-secondary', '', getButtonStyles(ThemeVariables.buttonSecondaryColor, ThemeVariables.buttonSecondaryTextColor, ThemeVariables.buttonSecondaryTextColor));
BASE_THEME.addStyle('btn-danger', '', getButtonStyles(ThemeVariables.buttonDangerColor, ThemeVariables.buttonDangerTextColor));
BASE_THEME.addStyle('btn-success', '', getButtonStyles(ThemeVariables.buttonSuccessColor, ThemeVariables.buttonSuccessTextColor));
BASE_THEME.addStyle('btn-warning', '', getButtonStyles(ThemeVariables.buttonWarningColor, ThemeVariables.buttonWarningTextColor));
BASE_THEME.addStyle('btn-link', '', linkBtnStyle);
BASE_THEME.addStyle('btn-dark', '', getButtonStyles(ThemeVariables.buttonDarkColor, ThemeVariables.buttonDarkTextColor));
BASE_THEME.addStyle('btn-light', '', getButtonStyles(ThemeVariables.buttonLightColor, ThemeVariables.buttonLightTextColor));

