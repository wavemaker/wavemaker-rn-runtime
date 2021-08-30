import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmGridColumnStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-gridcolumn';
export const DEFAULT_STYLES: WmGridColumnStyles = {
    root: {
      paddingVertical: 12,
      paddingHorizontal: 8
    },
    text: {}
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);

BASE_THEME.addStyle('table-cell', DEFAULT_CLASS, {});
