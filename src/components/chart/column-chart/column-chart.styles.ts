import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmColumnChartStyles = BaseStyles & {};

export const DEFAULT_CLASS = 'app-column-chart';
export const DEFAULT_STYLES: WmColumnChartStyles = defineStyles(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', BaseChartStyles);
