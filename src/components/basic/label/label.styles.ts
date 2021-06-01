import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export const DEFAULT_CLASS = 'app-label';
export const DEFAULT_STYLES = {
    root: {
    },
    asterisk: {
      color: 'red',
      marginLeft: 2
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getLabelStyles = (color: string) => {
  return {
    root: {
      backgroundColor: color
    }
  };
};

BASE_THEME.addStyle('label-danger', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelDangerColor));
BASE_THEME.addStyle('label-default', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelDefaultColor));
BASE_THEME.addStyle('label-info', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelInfoColor));
BASE_THEME.addStyle('label-primary', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelPrimaryColor));
BASE_THEME.addStyle('label-success', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelSuccessColor));
BASE_THEME.addStyle('label-warning', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelWarningColor));

const getTextStyles = (color: string) => {
  return {
    root: {
      color: color
    }
  };
};

BASE_THEME.addStyle('text-danger', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextDangerColor));
BASE_THEME.addStyle('text-info', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextInfoColor));
BASE_THEME.addStyle('text-primary', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextPrimaryColor));
BASE_THEME.addStyle('text-success', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextSuccessColor));
BASE_THEME.addStyle('text-warning', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextWarningColor));
