import Color from 'color';
import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ImageStyle, ViewStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmMenuStyles } from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmPopoverStyles } from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.styles';

export type WmAppNavbarStyles = BaseStyles & {
  action: WmIconStyles,
  image: ImageStyle,
  leftnavIcon: WmIconStyles,
  backIcon: WmIconStyles,
  leftSection: ViewStyle,
  middleSection: ViewStyle,
  rightSection: ViewStyle,
  content: ViewStyle
};

export const DEFAULT_CLASS = 'app-appnavbar';
export const DEFAULT_STYLES: WmAppNavbarStyles = defineStyles({
  root: {
    flexDirection: 'row',
    backgroundColor: ThemeVariables.navbarBackgroundColor,
    height: 80,
    padding: 12,
    paddingHorizontal: 12,
    alignItems: 'center'
  },
  text: {},
  action: {} as WmIconStyles,
  leftSection: {
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
  backIcon: {
    root: {},
    text: {
      fontSize: ThemeVariables.navbarFontSize,
      color: ThemeVariables.navbarTextColor
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
    textTransform: 'capitalize',
    color: ThemeVariables.navbarTextColor,
    fontSize: ThemeVariables.navbarFontSize,
    fontFamily: ThemeVariables.baseFont,
    fontWeight: '500',
    textAlign: 'center'
  },
  middleSection: {
    alignItems: 'center',
    alignContent: 'center'
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
} as WmAppNavbarStyles);

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
  badge: {
      backgroundColor: Color(ThemeVariables.navbarTextColor).fade(0.8).rgb().toString(),
      color: ThemeVariables.navbarTextColor,
  },
  icon: {
    text: {
      color: ThemeVariables.navbarTextColor,
      fontSize: ThemeVariables.navbarIconSize
    },
    icon : {
      color: ThemeVariables.navbarTextColor
    }
  }
} as WmAnchorStyles);
BASE_THEME.addStyle('navbarButton', '', {
  root: {
    backgroundColor: ThemeVariables.transparent,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  text: {
    color: ThemeVariables.navbarTextColor,
    fontSize: ThemeVariables.navbarFontSize
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
