import React from 'react';
import {VictoryAxis, VictoryChart, VictoryBar, VictoryTheme} from "victory-native";

import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import WmBarChartProps from './bar-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmBarChartStyles } from './bar-chart.styles';

export class WmBarChartState extends BaseChartComponentState<WmBarChartProps> {}

export default class WmBarChart extends BaseChartComponent<WmBarChartProps, WmBarChartState, WmBarChartStyles> {

  constructor(props: WmBarChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmBarChartProps());
  }

  renderWidget(props: WmBarChartProps) {
    return (<VictoryChart
      theme={VictoryTheme.material}
    >
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} />
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryBar key={props.name + '_' + i}
            horizontal={props.horizontal}
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            data={d}
          />
        })
      }
    </VictoryChart>);
  }
}
