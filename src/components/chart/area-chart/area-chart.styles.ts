import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmAreaChartStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-area-chart';
export const DEFAULT_STYLES: WmAreaChartStyles = defineStyles({
    root: {},
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
