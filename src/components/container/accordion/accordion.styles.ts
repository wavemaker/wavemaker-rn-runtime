import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle, ViewStyle, Platform } from 'react-native';
import Color from 'color';

export type WmAccordionStyles = BaseStyles & {
  icon: WmIconStyles,
  rightToggleIcon: WmIconStyles,
  leftToggleIcon: WmIconStyles,
  activeIcon: WmIconStyles,
  pane: AllStyle,
  badge: AllStyle,
  activeBadge: AllStyle,
  firstHeader: ViewStyle,
  lastHeader: ViewStyle,
  header: AllStyle,
  activeHeader: AllStyle,
  activeHeaderTitle: TextStyle,
  subheading: AllStyle,
  titleIcon: WmIconStyles
};

export const DEFAULT_CLASS = 'app-accordion';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmAccordionStyles = defineStyles({
      root: {
        width: '100%',
        borderWidth: 0,
        borderStyle: 'solid',
        borderColor: themeVariables.accordionBorderColor,
        borderRadius: 6,
        backgroundColor: themeVariables.transparent
      },
      text: {
        color: themeVariables.accordionTitleColor,
        fontSize: 18
      },
      firstHeader: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
      },
      pane : {},
      header: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.accordionBorderColor,
        backgroundColor: themeVariables.accordionHeaderBgColor,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center'
      },
      lastHeader: {
        borderBottomWidth: 0,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6
      },
      activeHeader: {
        borderColor: themeVariables.accordionActiveHeaderBgColor,
        backgroundColor: themeVariables.accordionActiveHeaderBgColor
      },
      activeHeaderTitle: {
        color: themeVariables.accordionActiveHeaderTextColor
      },
      subheading: {

      },
      icon: {
        root: {
          alignSelf: 'auto',
          width: 24,
          height: 24,
          borderRadius: 24,
          justifyContent: 'center'
        },
        icon: {
          color: themeVariables.accordionIconColor,
          alignSelf: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 'bold'
        }
      } as WmIconStyles,
      leftToggleIcon: {
        root: {}
      } as WmIconStyles,
      rightToggleIcon: {
        root: {}
      } as WmIconStyles,
      activeIcon : {
        root: {
          borderColor: themeVariables.accordionActiveHeaderTextColor,
        },
        icon: {
          color: themeVariables.accordionActiveHeaderTextColor
        }
      } as WmIconStyles,
      activeBadge: {
        borderColor: themeVariables.accordionActiveHeaderTextColor,
        color: themeVariables.accordionActiveHeaderTextColor
      },
      badge: {
          color: themeVariables.accordionIconColor,
          fontSize: 14,
          marginRight: 4,
          width: 24,
          height: 24,
          borderRadius: 12,
          alignContent: 'center',
          borderStyle: 'solid',
          borderWidth: 2,
          borderColor: themeVariables.accordionIconColor,
          backgroundColor: themeVariables.transparent
      },
      titleIcon: {} as WmIconStyles,
      default: {},
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
  addStyle(DEFAULT_CLASS + '-rtl', '', Platform.OS=="web"?{
    text:{
        textAlign:'right',
    }  
  }:{
    text:{
      textAlign:'left',
    }  
  });
  addStyle('app-accordion1', '', {
    pane: {
      marginBottom: 0
    },
    leftToggleIcon: {
      root: {
        width: 1
      }
    },
    icon: {
      root: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
  } as WmAccordionStyles);
});
