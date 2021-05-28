import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-layoutgrid';
export const DEFAULT_STYLES = {
    root: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getGridStyles = (border: string) => {
  return {
    root: {
      border: border
    }
  };
};

BASE_THEME.addStyle('bordered', DEFAULT_CLASS, getGridStyles(`1px solid ${ThemeVariables.borderColor}`));
