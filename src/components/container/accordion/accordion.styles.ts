import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';

export type WmAccordionStyles = BaseStyles & {
  icon: WmIconStyles,
  badge: AllStyle,
  header: AllStyle,
  subheading: AllStyle
};

export const DEFAULT_CLASS = 'app-accordion';
export const DEFAULT_STYLES: WmAccordionStyles = {
    root: {},
    text: {},
    header: {},
    subheading: {

    },
    icon: {
      root: {
        alignSelf: 'auto'
      },
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
