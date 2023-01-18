import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type BaseInputStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-baseinput';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: BaseInputStyles = defineStyles({
    root: {},
    text: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
