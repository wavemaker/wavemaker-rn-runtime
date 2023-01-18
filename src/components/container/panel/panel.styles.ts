import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmPanelStyles = BaseStyles & {
  icon: WmIconStyles,
  badge: AllStyle,
  header: AllStyle,
  subheading: AllStyle
};

export const DEFAULT_CLASS = 'app-panel';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmPanelStyles = defineStyles({
      root: {
        backgroundColor: themeVariables.panelBgColor,
        borderStyle: 'solid',
        borderWidth: 0,
        padding: 12,
        borderRadius: 6
      },
      text: {
        color: themeVariables.panelHeaderTextColor,
        fontSize: 16,
        fontWeight: 'bold'
      },
      header: {
        backgroundColor: themeVariables.panelHeaderBgColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderStyle: 'solid',
        borderWidth: 0,
        borderColor: themeVariables.panelHeaderBgColor,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
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
        color: themeVariables.badgeTextColor,
        marginRight: 8
      },
      default: {
        backgroundColor: themeVariables.labelDefaultColor
      },
      success: {
        backgroundColor: themeVariables.labelSuccessColor
      },
      danger: {
        backgroundColor: themeVariables.labelDangerColor
      },
      warning: {
        backgroundColor: themeVariables.labelWarningColor
      },
      info: {
        backgroundColor: themeVariables.labelInfoColor
      },
      primary: {
        backgroundColor: themeVariables.labelPrimaryColor
      }
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);

  const getPanelBgStyles = (color: string) => {
    return {
      header: {
        backgroundColor: color
      },
      text: {
        color: themeVariables.panelTextColor
      },
      subheading: {
        color: themeVariables.panelTextColor
      },
      icon: {
        text: {
          color: themeVariables.panelTextColor
        }
      } as WmIconStyles
    } as WmPanelStyles;
  };

  addStyle('panel-danger', '', getPanelBgStyles(themeVariables.panelDangerColor));
  addStyle('panel-default', '', getPanelBgStyles(themeVariables.panelDefaultColor));
  addStyle('panel-info', '', getPanelBgStyles(themeVariables.panelInfoColor));
  addStyle('panel-primary', '', getPanelBgStyles(themeVariables.panelPrimaryColor));
  addStyle('panel-success', '', getPanelBgStyles(themeVariables.panelSuccessColor));
  addStyle('panel-warning', '', getPanelBgStyles(themeVariables.panelWarningColor));
});