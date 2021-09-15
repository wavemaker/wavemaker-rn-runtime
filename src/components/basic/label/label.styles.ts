import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLabelStyles = BaseStyles & {
  asterisk: AllStyle
};

export const DEFAULT_CLASS = 'app-label';
export const DEFAULT_STYLES: WmLabelStyles = {
    root: {
    },
    text: {
      fontSize: 12,
      color: ThemeVariables.labelDefaultColor
    },
    asterisk: {
      color: ThemeVariables.labelAsteriskColor,
      marginLeft: 2
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getLabelStyles = (color: string, textColor: string): WmLabelStyles => {
  return {
    root: {
      backgroundColor: color,
      paddingLeft: 8,
      paddingTop: 4,
      paddingRight: 8,
      paddingBottom: 4,
      borderRadius: 4
    },
    text: {
      color: textColor,
      fontWeight: 'bold'
    }
  } as WmLabelStyles;
};

BASE_THEME.addStyle('label-danger', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelDangerColor, ThemeVariables.labelDangerContrastColor));
BASE_THEME.addStyle('label-default', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelDefaultColor, ThemeVariables.labelDefaultContrastColor));
BASE_THEME.addStyle('label-info', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelInfoColor, ThemeVariables.labelInfoContrastColor));
BASE_THEME.addStyle('label-primary', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelPrimaryColor, ThemeVariables.labelPrimaryContrastColor));
BASE_THEME.addStyle('label-success', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelSuccessColor, ThemeVariables.labelSuccessContrastColor));
BASE_THEME.addStyle('label-warning', DEFAULT_CLASS, getLabelStyles(ThemeVariables.labelWarningColor, ThemeVariables.labelWarningContrastColor));

const getTextStyles = (color: string) => {
  return {
    text: {
      color: color
    }
  } as WmLabelStyles;
};

BASE_THEME.addStyle('text-danger', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextDangerColor));
BASE_THEME.addStyle('text-info', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextInfoColor));
BASE_THEME.addStyle('text-primary', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextPrimaryColor));
BASE_THEME.addStyle('text-success', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextSuccessColor));
BASE_THEME.addStyle('text-warning', DEFAULT_CLASS, getTextStyles(ThemeVariables.labelTextWarningColor));
BASE_THEME.addStyle('text-center', DEFAULT_CLASS, {
  root: {
    textAlign: 'center'
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-left', DEFAULT_CLASS, {
  root: {
    textAlign: 'left'
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-right', DEFAULT_CLASS, {
  root: {
    textAlign: 'right'
  }
} as WmLabelStyles);


const getHeadingStyles = (fontSize: number) => {
  return {
    text: {
      fontWeight: '400',
      fontSize: fontSize,
      margin: 4
    }
  } as WmLabelStyles;
};
BASE_THEME.addStyle('h1', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading1FontSize));
BASE_THEME.addStyle('h2', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading2FontSize));
BASE_THEME.addStyle('h3', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading3FontSize));
BASE_THEME.addStyle('h4', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading4FontSize));
BASE_THEME.addStyle('h5', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading5FontSize));
BASE_THEME.addStyle('h6', DEFAULT_CLASS, getHeadingStyles(ThemeVariables.heading6FontSize));
BASE_THEME.addStyle('media-heading', DEFAULT_CLASS, {
  text : {
    fontSize: 16
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-muted', DEFAULT_CLASS, {
  text : {
    fontSize: 12,
    color: ThemeVariables.labelTextMutedColor
  }
} as WmLabelStyles);
BASE_THEME.addStyle('p', DEFAULT_CLASS, {
  text : {
    fontSize: 12
  }
} as WmLabelStyles);
