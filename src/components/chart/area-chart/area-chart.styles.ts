import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_CLASS as BASE_CHART_DEFAULT_CLASS } from '../basechart.styles';

export type WmAreaChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-area-chart';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    addStyle(DEFAULT_CLASS, BASE_CHART_DEFAULT_CLASS, {});
});
