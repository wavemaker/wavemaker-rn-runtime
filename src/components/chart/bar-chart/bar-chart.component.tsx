import React from 'react';
import { View } from 'react-native';

import {VictoryAxis, VictoryChart, VictoryBar, VictoryTheme, VictoryLegend, VictoryContainer} from "victory-native";

import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import WmBarChartProps from './bar-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmBarChartStyles } from './bar-chart.styles';
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";
import {Svg} from "react-native-svg";

export class WmBarChartState extends BaseChartComponentState<WmBarChartProps> {}

export default class WmBarChart extends BaseChartComponent<WmBarChartProps, WmBarChartState, WmBarChartStyles> {

  constructor(props: WmBarChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmBarChartProps(), new WmBarChartState());
  }

  renderWidget(props: WmBarChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    let chartHeight = this.chartHeight || 250;
    let chartWidth = this.chartWidth || this.screenWidth;
    const legendHeight = 60 || props.legendheight;
    const pChartHeight = chartHeight + legendHeight;
    return (<VictoryChart theme={this.state.theme}
                          height={pChartHeight}
                          width={chartWidth}
                          padding={{ top: 70, bottom: 50, left: 50, right: 50 }}>
      <VictoryLegend
        name={'legend'}
        containerComponent={<Svg />}
        title={props.title}
        centerTitle
        orientation="horizontal"
        gutter={20}
        data={this.state.legendData}
        x={125}
        itemsPerRow={3}
      />
      <VictoryAxis theme={this.state.theme} crossAxis />
      <VictoryAxis theme={this.state.theme} crossAxis dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryBar key={props.name + '_' + i}
            horizontal={props.horizontal}
            data={d}
            height={100}
            width={chartWidth}
            style={{
              data: {stroke: (this.state.colors[i] || ThemeVariables.chartLineColor)}
            }}
          />
        })
      }
    </VictoryChart>);
  }
}
