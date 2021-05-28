import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-gridcolumn';
export const DEFAULT_STYLES = {
    root: {
        flex: 1
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getGridColumnStyles = (border: string) => {
  return {
    root: {
      border: border
    }
  };
};

BASE_THEME.addStyle('column-bordered', DEFAULT_CLASS, getGridColumnStyles(`1px solid ${ThemeVariables.borderColor}`));
