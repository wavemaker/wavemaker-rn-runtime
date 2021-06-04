import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-nav';
export const DEFAULT_STYLES = {
    root: {
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('navAnchorItem', '', {
  root: {
    padding: 12
  },
  text: {
    textDecoration: 'none'
  }
});
