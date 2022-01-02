import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmAnchorStyles } from '@wavemaker/app-rn-runtime/components/basic/anchor/anchor.styles';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { ViewStyle } from 'react-native';

export type WmNavItemStyles = BaseStyles & {
  navAnchorItem: WmAnchorStyles,
  dropdownNav: ViewStyle,
  caretIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-navitem';
export const DEFAULT_STYLES: WmNavItemStyles = defineStyles({
    root: {
      borderWidth: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.navbarBorderColor
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
      text: {}
    } as WmAnchorStyles,
    caretIcon: {
      text: {
        color: ThemeVariables.navbarCaretColor
      }
    } as WmIconStyles
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle(DEFAULT_CLASS + '-active', DEFAULT_CLASS, {
  root : {
    backgroundColor: ThemeVariables.navitemActiveBackgroundColor
  },
  navAnchorItem: {
    text: {
      color: ThemeVariables.navitemActiveTextColor
    },
    icon: {
      text: {
        color: ThemeVariables.navitemActiveIconColor
      }
    }
  }
} as WmNavItemStyles);

BASE_THEME.addStyle(DEFAULT_CLASS + '-child', DEFAULT_CLASS, {
  root : {
    backgroundColor: ThemeVariables.navitemChildBackgroundColor
  },
  navAnchorItem: {
    text: {
      color: ThemeVariables.navitemChildTextColor,
      textDecorationLine: 'underline'
    },
    icon: {
      text: {
        color: ThemeVariables.navitemChildIconColor
      }
    }
  }
} as WmNavItemStyles);
BASE_THEME.addStyle('navAnchorItem', '',  DEFAULT_STYLES.navAnchorItem);
