import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle } from 'react-native';

export type WmAccordionStyles = BaseStyles & {
  icon: WmIconStyles,
  activeIcon: WmIconStyles,
  badge: AllStyle,
  header: AllStyle,
  activeHeader: AllStyle,
  activeHeaderTitle: TextStyle,
  subheading: AllStyle
};

export const DEFAULT_CLASS = 'app-accordion';
export const DEFAULT_STYLES: WmAccordionStyles = {
    root: {
      width: '100%',
      borderWidth: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.accordionBorderColor,
      backgroundColor: ThemeVariables.accordionBgColor
    },
    text: {
      color: ThemeVariables.accordionTitleColor
    },
    header: {
      borderWidth: 1,
      borderBottomWidth: 0,
      borderStyle: 'solid',
      borderColor: ThemeVariables.accordionBorderColor,
      backgroundColor: ThemeVariables.accordionHeaderBgColor
    },
    activeHeader: {
      borderColor: ThemeVariables.accordionActiveHeaderBgColor,
      backgroundColor: ThemeVariables.accordionActiveHeaderBgColor
    },
    activeHeaderTitle: {
      color: ThemeVariables.accordionActiveHeaderTextColor
    },
    subheading: {

    },
    icon: {
      root: {
        alignSelf: 'auto'
      },
      icon: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    } as WmIconStyles,
    activeIcon : {
      icon: {
        fontSize: 16,
        fontWeight: 'bold',
        color: ThemeVariables.accordionActiveHeaderTextColor
      }
    } as WmIconStyles,
    badge: {
        color: ThemeVariables.badgeTextColor,
        fontSize: 14
    },
    default: {
      backgroundColor: ThemeVariables.labelDefaultColor
    },
    success: {
      backgroundColor: ThemeVariables.labelSuccessColor
    },
    danger: {
      backgroundColor: ThemeVariables.labelDangerColor
    },
    warning: {
      backgroundColor: ThemeVariables.labelWarningColor
    },
    info: {
      backgroundColor: ThemeVariables.labelInfoColor
    },
    primary: {
      backgroundColor: ThemeVariables.labelPrimaryColor
    }
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
