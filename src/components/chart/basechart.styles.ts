import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { VictoryStyleObject } from "victory-core";


export type BaseChartComponentStyles = BaseStyles & {
  grid: VictoryStyleObject
};

export const DEFAULT_CLASS = 'app-chart';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: BaseChartComponentStyles = defineStyles({
    root: {},
    text: {},
    line: {
      color: themeVariables.chartLineColor
    },
    grid: {},
    barChart: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
