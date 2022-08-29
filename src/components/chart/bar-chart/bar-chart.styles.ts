import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmBarChartStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-bar-chart';
export const DEFAULT_STYLES: WmBarChartStyles = defineStyles({
    root: {},
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
