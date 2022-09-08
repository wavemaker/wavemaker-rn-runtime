import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmBarChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-bar-chart';
export const DEFAULT_STYLES: WmBarChartStyles = defineStyles(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
