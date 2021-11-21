import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmFormActionStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-form-action';
export const DEFAULT_STYLES: WmFormActionStyles = {
  root: {
  },
  text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
