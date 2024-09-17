import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import {BaseChartComponentStyles, DEFAULT_CLASS as BASE_CHART_DEFAULT_CLASS} from '../basechart.styles';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

export type WmBarChartStyles = BaseStyles & BaseChartComponentStyles;

export const DEFAULT_CLASS = 'app-bar-chart';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    addStyle(DEFAULT_CLASS, BASE_CHART_DEFAULT_CLASS, {
        style: {
            root: {
                height: 200
            }
        } as WmSkeletonStyles
    });
});
