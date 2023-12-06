import { TextStyle, ViewStyle } from 'react-native';
import Color  from "color";
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { VictoryStyleObject } from "victory-core";
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';


export type BaseChartComponentStyles = BaseStyles & {
  title: TextStyle,
  icon: WmIconStyles,
  subHeading: TextStyle,
  axis: VictoryStyleObject,
  xAxis: VictoryStyleObject,
  yAxis: VictoryStyleObject,
  axisLabel: VictoryStyleObject,
  xAxisLabel: VictoryStyleObject,
  yAxisLabel: VictoryStyleObject,
  ticks: VictoryStyleObject,
  xTicks: VictoryStyleObject,
  yTicks: VictoryStyleObject,
  tickLabels: VictoryStyleObject,
  xTickLabels: VictoryStyleObject,
  yTickLabels: VictoryStyleObject,
  grid: VictoryStyleObject,
  xGrid: VictoryStyleObject,
  yGrid: VictoryStyleObject,
  legendText: TextStyle,
  legenedDot: ViewStyle 
};

export const DEFAULT_CLASS = 'app-chart';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
  const defaultStyles: BaseChartComponentStyles = defineStyles({
    root: {},
    text: {},
    icon: {
      icon: {
        fontSize: 20
      }
    } as WmIconStyles,
    line: {
      color: themeVariables.chartLineColor
    },
    title: {
      color: themeVariables.chartTitleColor,
      fontSize: 20,
      lineHeight: 24,
    },
    subHeading: {
      fontSize: 12,
      lineHeight: 16,
      color: themeVariables.chartSubTitleColor
    },
    legendText: {},
    legenedDot: {},
    axis: {
      stroke: Color(themeVariables.chartAxisColor).fade(0.3).rgb().toString()
    } as any,
    xAxis: {} as any,
    yAxis: {} as any,
    axisLabel: {} as any,
    xAxisLabel: {} as any,
    yAxisLabel: {} as any,
    grid: {
      stroke: Color(themeVariables.chartAxisColor).fade(0.8).rgb().toString(),
      strokeDasharray: '16 4'
    } as any,
    xGrid: {} as any,
    yGrid: {} as any,
    ticks: {
      stroke: Color(themeVariables.chartAxisColor).fade(0.8).rgb().toString(),
    } as any,
    xTicks: {} as any,
    yTicks: {} as any,
    tickLabels: {
      stroke: Color(themeVariables.chartAxisColor).fade(0.8).rgb().toString(),
    } as any,
    xTickLabels: {} as any,
    yTickLabels: {} as any,
    barChart: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
