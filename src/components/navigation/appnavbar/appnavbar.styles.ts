import Color from 'color';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ViewStyle } from 'react-native';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { WmMenuStyles } from '@wavemaker/app-rn-runtime/components/navigation/menu/menu.styles';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmPopoverStyles } from '@wavemaker/app-rn-runtime/components/navigation/popover/popover.styles';
import { WmPictureStyles } from '@wavemaker/app-rn-runtime/components/basic/picture/picture.styles';

export type WmAppNavbarStyles = BaseStyles & {
  action: WmIconStyles,
  image: WmPictureStyles,
  leftnavIcon: WmIconStyles,
  backIcon: WmIconStyles,
  leftSection: ViewStyle,
  middleSection: ViewStyle,
  rightSection: ViewStyle,
  content: ViewStyle
};

export const DEFAULT_CLASS = 'app-appnavbar';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmAppNavbarStyles = defineStyles({
    root: {
      flexDirection: 'row',
      backgroundColor: themeVariables.navitemActiveBackgroundColor,
      height: 80,
      padding: 12,
      paddingHorizontal: 12,
      alignItems: 'center'
    },
    text: {},
    action: {} as WmIconStyles,
    leftSection: {
      flex: 1,
      flexDirection: 'row'
    },
    leftnavIcon: {
      root: {
          alignItems: 'flex-start'
      },
      icon: {
          fontSize: themeVariables.navbarIconSize,
          color: themeVariables.navbarTextColor
      }
    } as WmIconStyles,
    backIcon: {
      root: {},
      text: {
        fontSize: themeVariables.navbarFontSize,
        color: themeVariables.navbarTextColor
      },
      icon: {
          fontSize: themeVariables.navbarIconSize,
          color: themeVariables.navbarTextColor
      }
    } as WmIconStyles,
    image: {
      root: {
        width: themeVariables.navbarImageSize,
        height: themeVariables.navbarImageSize,
      },
      picture: {
        resizeMode: 'contain'
      }
    } as WmPictureStyles,
    content: {
      textTransform: 'capitalize',
      color: themeVariables.navbarTextColor,
      fontSize: themeVariables.navbarFontSize,
      fontFamily: themeVariables.baseFont,
      fontWeight: '500',
      textAlign: 'center'
    },
    middleSection: {
      alignItems: 'center',
      flexDirection: 'row'
    },
    rightSection: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
  } as WmAppNavbarStyles);

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle('navbarAnchorItem', '', {
    root: {
      paddingRight: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      color: themeVariables.navbarTextColor,
      fontSize: themeVariables.navbarFontSize,
      textDecorationStyle: undefined
    },
    badge: {
        backgroundColor: Color(themeVariables.navbarTextColor).fade(0.8).rgb().toString(),
        color: themeVariables.navbarTextColor,
    },
    icon: {
      text: {
        color: themeVariables.navbarTextColor,
        fontSize: themeVariables.navbarIconSize
      },
      icon : {
        color: themeVariables.navbarTextColor
      }
    }
  } as WmAnchorStyles);
  addStyle('navbarButton', '', {
    root: {
      backgroundColor: themeVariables.transparent,
      paddingRight: 8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center'
    },
    text: {
      color: themeVariables.navbarTextColor,
      fontSize: themeVariables.navbarFontSize
    },
    icon: {
      root: {
        color: themeVariables.navbarTextColor
      },
      text: {
        color: themeVariables.navbarTextColor,
        fontSize: themeVariables.navbarIconSize
      }
    }
  } as WmAnchorStyles);
  addStyle('navbarMenu', '', {
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
          fontSize: themeVariables.navbarIconSize,
          color: themeVariables.navbarTextColor
        }
      },
      text: {
        color: themeVariables.navbarTextColor,
        fontSize: themeVariables.navbarFontSize
      }
    }
  } as any as WmMenuStyles);
  addStyle('navbarPopover', '', {
    root: {
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    link: {
      icon: {
        root: {
          fontSize: themeVariables.navbarIconSize,
          color: themeVariables.navbarTextColor
        }
      },
      text: {
        color: themeVariables.navbarTextColor,
        fontSize: themeVariables.navbarFontSize
      }
    }
  } as any as WmPopoverStyles);
});