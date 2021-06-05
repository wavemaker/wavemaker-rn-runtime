import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ImageStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmAnchorStyles } from '../../basic/anchor/anchor.styles';

export type WmAppNavbarStyles = BaseStyles & {
   image: ImageStyle,
   leftnavIcon: WmIconStyles,
   content: AllStyle
};

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES: WmAppNavbarStyles = {
  root: {
    backgroundColor: ThemeVariables.navbarBackgroundColor,
  },
  text: {},
  action: {
    borderRadius: 0
  },
  leftnavIcon: {
    root: {
        alignItems: 'flex-start'
    },
    icon: {
        fontSize: ThemeVariables.navbarIconSize,
        color: ThemeVariables.navbarTextColor
    }
  } as WmIconStyles,
  image: {
    width: ThemeVariables.navbarImageSize,
    height: ThemeVariables.navbarImageSize
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
    textDecorationStyle: undefined
  },
  icon: {
    text: {
      color: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarIconSize
    }
  }
} as WmAnchorStyles);
