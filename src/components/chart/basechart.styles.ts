import { TextStyle, ViewStyle } from 'react-native';
import BASE_THEME from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { VictoryStyleObject } from "victory-core";
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';


export type BaseChartComponentStyles = BaseStyles & {
  title: TextStyle,
  icon: WmIconStyles,
  subHeading: TextStyle,
  grid: VictoryStyleObject,
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
    grid: {},
    barChart: {}
  });

  addStyle(DEFAULT_CLASS, '', defaultStyles);
});
