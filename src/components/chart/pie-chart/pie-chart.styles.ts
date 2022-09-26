import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmPieChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-pie-chart';
export const DEFAULT_STYLES: WmPieChartStyles = defineStyles(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', BaseChartStyles);
