import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '../icon/icon.styles';

export type WmButtonStyles = BaseStyles & {
  content: AllStyle,
  badge: AllStyle,
  icon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-button';
export const DEFAULT_STYLES: WmButtonStyles = {
    root: {
        padding: 12,
        borderRadius: 4
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 12,
      textAlign: 'center'
    },
    badge: {
      backgroundColor: ThemeVariables.buttonBadgeBackgroundColor,
      color: ThemeVariables.buttonBadgeTextColor,
      alignSelf: 'flex-start',
      position: 'relative',
      top: -16,
      right: -16
    },
    icon: {
      text: {
        paddingRight: ThemeVariables.buttonTextPadding,
        fontSize: 14
      }
    } as WmIconStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

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
    icon: {
      text: {
        color: color
      }
    }
  } as WmButtonStyles;
}

BASE_THEME.addStyle('btn-default', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonDefaultColor, ThemeVariables.buttonDefaultTextColor, ThemeVariables.buttonBorderColor));
BASE_THEME.addStyle('btn-info', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonInfoColor, ThemeVariables.buttonInfoTextColor));
BASE_THEME.addStyle('btn-primary', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonPrimaryColor, ThemeVariables.buttonPrimaryTextColor));
BASE_THEME.addStyle('btn-secondary', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonSecondaryColor, ThemeVariables.buttonSecondaryTextColor));
BASE_THEME.addStyle('btn-danger', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonDangerColor, ThemeVariables.buttonDangerTextColor));
BASE_THEME.addStyle('btn-success', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonSuccessColor, ThemeVariables.buttonSuccessTextColor));
BASE_THEME.addStyle('btn-warning', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonWarningColor, ThemeVariables.buttonWarningTextColor));
BASE_THEME.addStyle('btn-link', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonLinkColor, ThemeVariables.buttonLinkTextColor));
BASE_THEME.addStyle('btn-dark', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonDarkColor, ThemeVariables.buttonDarkTextColor));
BASE_THEME.addStyle('btn-light', DEFAULT_CLASS, getButtonStyles(ThemeVariables.buttonLightColor, ThemeVariables.buttonLightTextColor));

