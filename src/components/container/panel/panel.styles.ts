import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { Platform } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmPanelStyles = BaseStyles & {
  icon: WmIconStyles,
  badge: AllStyle,
  header: AllStyle,
  subheading: AllStyle,
  skeleton: WmSkeletonStyles
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
        flexDirection: 'row',
        backgroundColor: themeVariables.panelHeaderBgColor,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderStyle: 'solid',
        borderWidth: 0,
        borderColor: themeVariables.panelHeaderBgColor,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
      },
      heading: {
        paddingHorizontal: 16
      },
      subheading: {
        paddingHorizontal: 16
      },
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
        marginRight: 8,
        alignSelf: 'center'
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
      },
      skeleton: {
        root: {
        }
      } as WmSkeletonStyles, 
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    text:{
      textAlign:'right',
    } ,
    subheading:{
      textAlign:'right',
    }
  }:{});
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