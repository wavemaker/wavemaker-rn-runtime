import React from 'react';
import { View } from 'react-native';

import {VictoryChart, VictoryContainer, VictoryLegend, VictoryLine, VictoryPie} from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPieChartStyles } from './pie-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import { Svg } from "react-native-svg";

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {
}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {

  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPieChartProps(), new WmPieChartState());
  }

  renderWidget(props: WmPieChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    let chartHeight = this.chartHeight || 250;
    let chartWidth = this.chartWidth || this.screenWidth;
    const legendHeight = 60 || props.legendheight;
    const pChartHeight = chartHeight + legendHeight;
    let total: number;
    if (props.labeltype === 'percent') {
      total = this.getTotal(this.state.data[0]);
    }
      return <VictoryContainer theme={this.state.theme}
                               height={pChartHeight}
                               width={chartWidth}>
        <VictoryLegend
          name={'legend'}
          theme={this.state.theme}
          title={props.title}
          centerTitle
          orientation="horizontal"
          gutter={20}
          data={this.state.legendData}
          x={125}
          itemsPerRow={3}
          height={legendHeight}
        />
    <VictoryPie
      height={chartHeight}
      width={chartWidth}
      labels={({datum}) => {
        const labelType = props.labeltype;
        if (labelType === 'percent') {
          return `${datum.y*100/total}%`
        } else if (labelType === 'key') {
          return `${datum.x}`;
        } else if (labelType === 'value') {
          return `${datum.y}`;
        } else if (labelType === 'key-value') {
          return `${datum.x} ${datum.y}`;
        }
        return null;
      }}
        animate={{
          duration: 1000
        }}
        innerRadius={this.state.props.innerradius}
        theme={this.state.theme}
        key={props.name}
        name={props.name}
        data={this.state.data[0]}

      />
      </VictoryContainer>
  }
}
