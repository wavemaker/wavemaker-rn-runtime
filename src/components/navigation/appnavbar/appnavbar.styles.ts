import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ImageStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmMenuStyles } from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmPopoverStyles } from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.styles';

export type WmAppNavbarStyles = BaseStyles & {
  action: AllStyle,
   image: ImageStyle,
   leftnavIcon: WmIconStyles,
   content: AllStyle
};

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES: WmAppNavbarStyles = {
  root: {
    backgroundColor: ThemeVariables.navbarBackgroundColor,
    height: 60
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
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
BASE_THEME.addStyle('navbarMenu', '', {
  root: {
    paddingRight: 8,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    icon: {
      root: {
        fontSize: ThemeVariables.navbarIconSize,
        color: ThemeVariables.navbarTextColor
      }
    },
    text: {
      color: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarFontSize
    }
  }
} as WmMenuStyles);
BASE_THEME.addStyle('navbarPopover', '', {
  root: {
    paddingRight: 8,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    icon: {
      root: {
        fontSize: ThemeVariables.navbarIconSize,
        color: ThemeVariables.navbarTextColor
      }
    },
    text: {
      color: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarFontSize
    }
  }
} as WmPopoverStyles);
