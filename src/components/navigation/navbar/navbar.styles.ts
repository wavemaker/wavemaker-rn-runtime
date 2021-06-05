import BASE_THEME, { AllStyle, NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmNavbarStyles = BaseStyles & {
  nav: AllStyle,
  navitem: AllStyle
};

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES: WmNavbarStyles = {
    root: {},
    text: {},
    nav: {flexDirection: 'row'},
    navitem: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('stackedNav', '', {
  root: {},
  nav: {
    flexDirection: 'column'
  },
  navitem: {}
} as WmNavbarStyles);
BASE_THEME.addStyle('justifiedNav', '', {
  root: {},
  nav: {},
  navitem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
} as WmNavbarStyles);
