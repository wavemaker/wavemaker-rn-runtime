import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmTabheaderStyles } from './tabheader/tabheader.styles';

export type WmTabsStyles = BaseStyles & {
  tabHeader: WmTabheaderStyles
};

export const DEFAULT_CLASS = 'app-tabs';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: WmTabsStyles = defineStyles({
      root: {
        minHeight: 240,
        elevation: 0,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: themeVariables.tabBorderColor
      },
      text: {},
      tabHeader: {} as WmTabheaderStyles
  });
  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
