import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { TextStyle } from 'react-native';

export type WmTabsStyles = BaseStyles & {
  activeHeaderText: TextStyle
};

export const DEFAULT_CLASS = 'app-tabs';
export const DEFAULT_STYLES: WmTabsStyles = defineStyles({
    root: {
      backgroundColor: 'transparent',
      elevation: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.tabBorderColor
    },
    text: {},
    activeHeaderText: {
      color: ThemeVariables.tabHeaderTextColor
    }
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
