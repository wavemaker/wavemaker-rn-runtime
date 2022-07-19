import React from 'react';
import { VictoryPie } from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPieChartStyles } from './pie-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {

  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPieChartProps());
  }

  renderWidget(props: WmPieChartProps) {
    return this.state.data.map((d: any, i: number) => {
      return <VictoryPie
        key={i}
        style={{
          data: {stroke: "#c43a31"},
          parent: {border: "1px solid #ccc"}
        }}
        data={d}
      />
    });
  }
}
