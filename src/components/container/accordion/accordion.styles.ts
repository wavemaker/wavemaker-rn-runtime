import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle, ViewStyle } from 'react-native';
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
  subheading: AllStyle
};

export const DEFAULT_CLASS = 'app-accordion';
export const DEFAULT_STYLES: WmAccordionStyles = defineStyles({
    root: {
      width: '100%',
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: ThemeVariables.accordionBorderColor,
      borderRadius: 6,
      backgroundColor: ThemeVariables.transparent
    },
    text: {
      color: ThemeVariables.accordionTitleColor,
      fontSize: 18
    },
    firstHeader: {
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6
    },
    pane : {
      marginBottom: 4,
    },
    header: {
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.accordionBorderColor,
      backgroundColor: ThemeVariables.accordionHeaderBgColor,
      padding: 8
    },
    lastHeader: {
      borderBottomWidth: 0,
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6
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
        alignSelf: 'auto',
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center'
      },
      icon: {
        color: ThemeVariables.accordionIconColor,
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
        borderColor: ThemeVariables.accordionActiveHeaderTextColor,
      },
      icon: {
        color: ThemeVariables.accordionActiveHeaderTextColor
      }
    } as WmIconStyles,
    activeBadge: {
      borderColor: ThemeVariables.accordionActiveHeaderTextColor,
      color: ThemeVariables.accordionActiveHeaderTextColor
    },
    badge: {
        color: ThemeVariables.accordionIconColor,
        fontSize: 14,
        marginRight: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        alignContent: 'center',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: ThemeVariables.accordionIconColor,
        backgroundColor: ThemeVariables.transparent
    },
    default: {},
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
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
BASE_THEME.addStyle('app-accordion1', '', {
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
