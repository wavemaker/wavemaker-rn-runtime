import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmLabelStyles = BaseStyles & {
  asterisk: AllStyle
};

export const DEFAULT_CLASS = 'app-label';
export const DEFAULT_STYLES: WmLabelStyles = defineStyles({
    root: {
    },
    text: {
      fontSize: 16,
      color: ThemeVariables.labelDefaultColor
    },
    asterisk: {
      color: ThemeVariables.labelAsteriskColor,
      marginLeft: 2
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

const getLabelStyles = (color: string, textColor: string): WmLabelStyles => {
  return {
    root: {
      backgroundColor: color,
      paddingLeft: 32,
      paddingTop: 16,
      paddingRight: 32,
      paddingBottom: 16,
      borderRadius: 6
    },
    text: {
      color: textColor,
      fontWeight: 'bold'
    }
  } as WmLabelStyles;
};

BASE_THEME.addStyle('label-danger', '', getLabelStyles(ThemeVariables.labelDangerColor, ThemeVariables.labelDangerContrastColor));
BASE_THEME.addStyle('label-default', '', getLabelStyles(ThemeVariables.labelDefaultColor, ThemeVariables.labelDefaultContrastColor));
BASE_THEME.addStyle('label-info', '', getLabelStyles(ThemeVariables.labelInfoColor, ThemeVariables.labelInfoContrastColor));
BASE_THEME.addStyle('label-primary', '', getLabelStyles(ThemeVariables.labelPrimaryColor, ThemeVariables.labelPrimaryContrastColor));
BASE_THEME.addStyle('label-success', '', getLabelStyles(ThemeVariables.labelSuccessColor, ThemeVariables.labelSuccessContrastColor));
BASE_THEME.addStyle('label-warning', '', getLabelStyles(ThemeVariables.labelWarningColor, ThemeVariables.labelWarningContrastColor));

const getTextStyles = (color: string) => {
  return {
    text: {
      color: color
    }
  } as WmLabelStyles;
};

BASE_THEME.addStyle('text-danger', '', getTextStyles(ThemeVariables.labelTextDangerColor));
BASE_THEME.addStyle('text-info', '', getTextStyles(ThemeVariables.labelTextInfoColor));
BASE_THEME.addStyle('text-primary', '', getTextStyles(ThemeVariables.labelTextPrimaryColor));
BASE_THEME.addStyle('text-success', '', getTextStyles(ThemeVariables.labelTextSuccessColor));
BASE_THEME.addStyle('text-warning', '', getTextStyles(ThemeVariables.labelTextWarningColor));
BASE_THEME.addStyle('text-center', '', {
  root: {
    textAlign: 'center'
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-left', '', {
  root: {
    textAlign: 'left'
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-right', '', {
  root: {
    textAlign: 'right'
  }
} as WmLabelStyles);


const getHeadingStyles = (fontSize: number, overrides?: WmLabelStyles) => {
  return deepCopy({
    text: {
      fontWeight: '400',
      fontSize: fontSize,
      margin: 4
    }
  } as WmLabelStyles, overrides);
};
BASE_THEME.addStyle('h1', '', getHeadingStyles(ThemeVariables.heading1FontSize, {text: {fontWeight: 'bold'}} as WmLabelStyles));
BASE_THEME.addStyle('h2', '', getHeadingStyles(ThemeVariables.heading2FontSize, {text: {fontWeight: '500'}} as WmLabelStyles));
BASE_THEME.addStyle('h3', '', getHeadingStyles(ThemeVariables.heading3FontSize));
BASE_THEME.addStyle('h4', '', getHeadingStyles(ThemeVariables.heading4FontSize));
BASE_THEME.addStyle('h5', '', getHeadingStyles(ThemeVariables.heading5FontSize));
BASE_THEME.addStyle('h6', '', getHeadingStyles(ThemeVariables.heading6FontSize));
BASE_THEME.addStyle('media-heading', '', {
  text : {
    fontSize: 16
  }
} as WmLabelStyles);
BASE_THEME.addStyle('text-muted', '', {
  text : {
    color: ThemeVariables.labelTextMutedColor
  }
} as WmLabelStyles);
BASE_THEME.addStyle('p', '', {
  text : {
    fontSize: 12
  }
} as WmLabelStyles);
