import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmDonutChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-donut-chart';
export const DEFAULT_STYLES: WmDonutChartStyles = defineStyles(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', BaseChartStyles);
