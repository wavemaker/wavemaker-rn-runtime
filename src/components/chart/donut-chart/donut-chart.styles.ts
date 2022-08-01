import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';

export type WmDonutChartStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-donut-chart';
export const DEFAULT_STYLES: WmDonutChartStyles = defineStyles({
    root: {},
    text: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);