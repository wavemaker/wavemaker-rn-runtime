import BASE_THEME, { AllStyle }  from '@wavemaker/app-rn-runtime/styles/theme';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmSkeletonStyles } from '../skeleton/skeleton.styles';
import { WmAnchorStyles } from '../anchor/anchor.styles';

export type WmLabelStyles = BaseStyles & {
  asterisk: AllStyle,
  skeleton: WmSkeletonStyles 
  link: WmAnchorStyles
};

export const DEFAULT_CLASS = 'app-label';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmLabelStyles = defineStyles({
      root: {
        alignSelf: 'flex-start'
      },
      text: {
        fontSize: 16,
        color: themeVariables.labelDefaultColor
      },
      asterisk: {
        color: themeVariables.labelAsteriskColor,
        marginLeft: 2
      },
      skeleton: {
        root:{
          width: '100%',
          height: 16,
          borderRadius: 4
        }
      } as any as WmSkeletonStyles,
      link: {
        text: {
          textDecorationLine: 'underline'
        }
      } as WmAnchorStyles
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', {
    root : {
      flexDirection: 'row',
      textAlign: 'right'
    }
  });
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

  addStyle('label-danger', '', getLabelStyles(themeVariables.labelDangerColor, themeVariables.labelDangerContrastColor));
  addStyle('label-default', '', getLabelStyles(themeVariables.labelDefaultColor, themeVariables.labelDefaultContrastColor));
  addStyle('label-info', '', getLabelStyles(themeVariables.labelInfoColor, themeVariables.labelInfoContrastColor));
  addStyle('label-primary', '', getLabelStyles(themeVariables.labelPrimaryColor, themeVariables.labelPrimaryContrastColor));
  addStyle('label-success', '', getLabelStyles(themeVariables.labelSuccessColor, themeVariables.labelSuccessContrastColor));
  addStyle('label-warning', '', getLabelStyles(themeVariables.labelWarningColor, themeVariables.labelWarningContrastColor));
  addStyle('label-test', '', getLabelStyles('yellow', 'red'));
  addStyle('label-test1', '', getLabelStyles('blue', 'orange'));
  addStyle('label-test111', '', getLabelStyles('grey', 'red'));

  const getTextStyles = (color: string) => {
    return {
      text: {
        color: color
      }
    } as WmLabelStyles;
  };

  addStyle('text-danger', '', getTextStyles(themeVariables.labelTextDangerColor));
  addStyle('text-info', '', getTextStyles(themeVariables.labelTextInfoColor));
  addStyle('text-primary', '', getTextStyles(themeVariables.labelTextPrimaryColor));
  addStyle('text-success', '', getTextStyles(themeVariables.labelTextSuccessColor));
  addStyle('text-warning', '', getTextStyles(themeVariables.labelTextWarningColor));
  addStyle('text-center', '', {
    root: {
      textAlign: 'center'
    }
  } as WmLabelStyles);
  addStyle('text-left', '', {
    root: {
      textAlign: 'left'
    }
  } as WmLabelStyles);
  addStyle('text-right', '', {
    root: {
      textAlign: 'right'
    }
  } as WmLabelStyles);


  const getHeadingStyles = (fontSize: number, overrides?: WmLabelStyles) => {
    return deepCopy({
      text: {
        fontWeight: '400',
        fontSize: fontSize,
        margin: 4,
        color: themeVariables.labelHeaderColor
      }
    } as WmLabelStyles, overrides);
  };
  addStyle('h1', '', getHeadingStyles(themeVariables.heading1FontSize, {text: {fontWeight: 'bold'}} as WmLabelStyles));
  addStyle('h2', '', getHeadingStyles(themeVariables.heading2FontSize, {text: {fontWeight: '500'}} as WmLabelStyles));
  addStyle('h3', '', getHeadingStyles(themeVariables.heading3FontSize));
  addStyle('h4', '', getHeadingStyles(themeVariables.heading4FontSize));
  addStyle('h5', '', getHeadingStyles(themeVariables.heading5FontSize));
  addStyle('h6', '', getHeadingStyles(themeVariables.heading6FontSize));
  addStyle('media-heading', '', {
    text : {
      fontSize: 16
    }
  } as WmLabelStyles);
  addStyle('text-muted', '', {
    text : {
      color: themeVariables.labelTextMutedColor
    }
  } as WmLabelStyles);
  addStyle('p', '', {
    text : {
      fontSize: 12
    }
  } as WmLabelStyles);
});
