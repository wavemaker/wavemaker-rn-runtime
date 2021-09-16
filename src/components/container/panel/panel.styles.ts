import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmPanelStyles = BaseStyles & {
  icon: WmIconStyles,
  badge: AllStyle,
  header: AllStyle,
  subheading: AllStyle
};

export const DEFAULT_CLASS = 'app-panel';
export const DEFAULT_STYLES: WmPanelStyles = {
    root: {
      backgroundColor: ThemeVariables.panelBgColor
    },
    text: {},
    header: {
      backgroundColor: ThemeVariables.panelHeaderBgColor,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderStyle: 'solid',
      borderWidth: 0,
      borderColor: ThemeVariables.panelHeaderBgColor
    },
    subheading: {},
    icon: {
      root: {
        alignSelf: 'auto',
        fontSize: 32,
      },
    } as WmIconStyles,
    toggleIcon: {
      root: {
        fontSize: 16,
      },
    } as WmIconStyles,
    badge: {
      color: ThemeVariables.badgeTextColor,
      marginRight: 8
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

const getPanelBgStyles = (color: string) => {
  return {
    header: {
      backgroundColor: color
    },
    text: {
      color: ThemeVariables.panelTextColor
    },
    subheading: {
      color: ThemeVariables.panelTextColor
    },
    icon: {
      text: {
        color: ThemeVariables.panelTextColor
      }
    } as WmIconStyles
  } as WmPanelStyles;
};

BASE_THEME.addStyle('panel-danger', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelDangerColor));
BASE_THEME.addStyle('panel-default', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelDefaultColor));
BASE_THEME.addStyle('panel-info', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelInfoColor));
BASE_THEME.addStyle('panel-primary', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelPrimaryColor));
BASE_THEME.addStyle('panel-success', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelSuccessColor));
BASE_THEME.addStyle('panel-warning', DEFAULT_CLASS, getPanelBgStyles(ThemeVariables.panelWarningColor));
