import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { ViewStyle } from 'react-native';

export type WmNavItemStyles = BaseStyles & {
  navAnchorItem: WmAnchorStyles,
  dropdownNav: ViewStyle,
  caretIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-navitem';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmNavItemStyles = defineStyles({
      root: {
        backgroundColor: themeVariables.navbarBackgroundColor,
      },
      text: {},
      dropdownNav: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      navAnchorItem: {
        root: {
          padding: 12
        },
        text: {
          color: themeVariables.navbarTextColor,
          fontFamily: themeVariables.baseFont,
          lineHeight: 20,
          fontSize: 14,
          fontWeight: '500',
        },
        icon: {
          text: {
            color: themeVariables.navbarTextColor,
            fontSize: 24
          }
        }
      } as WmAnchorStyles,
      caretIcon: {
        root : {
          paddingRight: 12
        },
        text: {
          color: themeVariables.navbarCaretColor
        }
      } as WmIconStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-active', DEFAULT_CLASS, {
    root : {
      backgroundColor: themeVariables.navitemActiveBackgroundColor
    },
    navAnchorItem: {
      text: {
        color: themeVariables.navitemActiveTextColor,
        fontFamily: themeVariables.baseFont,
        lineHeight: 20,
        fontSize: 14,
        fontWeight: '700',
      },
      icon: {
        text: {
          color: themeVariables.navitemActiveIconColor
        }
      }
    }
  } as WmNavItemStyles);

  addStyle(DEFAULT_CLASS + '-child', DEFAULT_CLASS, {
    root : {
      backgroundColor: themeVariables.navitemChildBackgroundColor
    },
    navAnchorItem: {
      text: {
        color: themeVariables.navitemChildTextColor,
      },
      icon: {
        text: {
          color: themeVariables.navitemChildIconColor
        }
      }
    }
  } as WmNavItemStyles);
  addStyle('navAnchorItem', '',  defaultStyles.navAnchorItem);
});