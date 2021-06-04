import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';

export const DEFAULT_CLASS = 'app-navbar';
export const DEFAULT_STYLES = {
    root: {},
    nav: {
      flexDirection: 'row'
    },
    navitem: {
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('stackedNav', '', {
  root: {},
  nav: {
    flexDirection: 'column'
  },
  navitem: {}
});
BASE_THEME.addStyle('justifiedNav', '', {
  root: {},
  nav: {},
  navitem: {
    flex: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
