import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { WmTabheaderStyles } from './tabheader/tabheader.styles';

export type WmTabsStyles = BaseStyles & {
  tabHeader: WmTabheaderStyles
};

export const DEFAULT_CLASS = 'app-tabs';
export const DEFAULT_STYLES: WmTabsStyles = defineStyles({
    root: {
      minHeight: 120,
      elevation: 0,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: ThemeVariables.tabBorderColor,
      overflow: 'hidden'
    },
    text: {},
    tabHeader: {} as WmTabheaderStyles
} as WmTabsStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
