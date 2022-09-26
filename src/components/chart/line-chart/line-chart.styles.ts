import BASE_THEME, {AllStyle} from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmLineChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-line-chart';
export const DEFAULT_STYLES: WmLineChartStyles = defineStyles(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', BaseChartStyles);
