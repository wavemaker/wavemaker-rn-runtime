import BASE_THEME, { NamedStyles } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmNavItemStyles = BaseStyles & {

};

export const DEFAULT_CLASS = 'app-nav';
export const DEFAULT_STYLES: WmNavItemStyles = {
    root: {},
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('navAnchorItem', '', {
  root: {
    padding: 12
  },
  text: {
    textDecorationStyle: undefined
  }
} as WmNavItemStyles);
