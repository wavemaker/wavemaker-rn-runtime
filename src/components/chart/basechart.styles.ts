import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { VictoryStyleObject } from "victory-core";


export type BaseChartComponentStyles = BaseStyles & {
  grid: VictoryStyleObject
};

export const DEFAULT_CLASS = 'app-chart';
export const DEFAULT_STYLES: BaseChartComponentStyles = defineStyles({
  root: {},
  text: {},
  line: {
    color: ThemeVariables.chartLineColor
  },
  grid: {},
  barChart: {}
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);
