import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-picture';
export const DEFAULT_STYLES = {
  root: {},
  cover: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('rounded', DEFAULT_CLASS, {
  root: {
    borderRadius: 6
  }
});
BASE_THEME.addStyle('circle', DEFAULT_CLASS, {
  root: {
    borderRadius: '50%'
  }
});
BASE_THEME.addStyle('thumbnail', DEFAULT_CLASS, {
  root: {
    backgroundColor: ThemeVariables.pictureThumbBgColor,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: ThemeVariables.pictureThumbBorderColor,
    borderRadius: 6
  }
});
