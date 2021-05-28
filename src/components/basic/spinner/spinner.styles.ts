import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-spinner';
export const DEFAULT_STYLES = {
  root: {
    textAlign: 'center'
  },
  text: {
    fontSize: 14,
    paddingLeft: '8px'
  },
  icon: {
    text: {
      color: ThemeVariables.primaryColor
    }
  }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
