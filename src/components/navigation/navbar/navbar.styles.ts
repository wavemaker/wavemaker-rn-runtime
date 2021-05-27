import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES = {
    root: {
      textColor: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarFontSize
    },
    leftnavIcon: {
        borderRadius: 0,
        root: {
            alignItems: 'flex-start'
        },
        icon: {
            fontSize: ThemeVariables.navbarIconSize,
            color: ThemeVariables.navbarTextColor
        }
    },
  image: {
    size: ThemeVariables.navbarImageSize
  },
  content: {
    fontSize: ThemeVariables.navbarFontSize
  }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('navbarAnchorItem', '', {
  root: {
    paddingRight: ThemeVariables.anchorTextPadding
  },
  text: {
    color: ThemeVariables.navbarTextColor,
    fontSize: ThemeVariables.navbarFontSize,
    textDecoration: 'none'
  },
  icon: {
    text: {
      color: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarIconSize
    }
  }})
