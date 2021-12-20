import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { ViewStyle } from 'react-native';

export type WmNavbarStyles = BaseStyles & {
  nav: AllStyle,
  navitem: AllStyle,
  childNav: ViewStyle
};

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES: WmNavbarStyles = defineStyles({
    root: {},
    text: {},
    nav: {
      flexDirection: 'row'
    },
    navitem: {},
    childNav: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('stackedNav', '', {
  root: {},
  nav: {
    flexDirection: 'column'
  },
  text: {
    textDecorationLine: 'none'
  },
  navitem: {},
  childNav:  {
    paddingLeft: 12
  }
} as WmNavbarStyles);
BASE_THEME.addStyle('childNav', '', {
  navitem: {}
} as WmNavbarStyles);
BASE_THEME.addStyle('justifiedNav', '', {
  root: {},
  nav: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navitem: {}
} as WmNavbarStyles);
