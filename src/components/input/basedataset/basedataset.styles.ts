import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type BaseDatasetStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-basenumber';
export const DEFAULT_STYLES: BaseDatasetStyles = {
  root: {},
  text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
