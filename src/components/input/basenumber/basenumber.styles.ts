import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type BaseNumberStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-basenumber';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: BaseNumberStyles = defineStyles({
    root: {},
    text: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
