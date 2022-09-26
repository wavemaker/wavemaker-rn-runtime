import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_STYLES as BaseChartStyles} from '../basechart.styles';

export type WmAreaChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-area-chart';
export const DEFAULT_STYLES: WmAreaChartStyles = defineStyles<WmAreaChartStyles>(BaseChartStyles);

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
