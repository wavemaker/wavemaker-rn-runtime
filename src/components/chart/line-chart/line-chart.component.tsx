import React from 'react';
import { VictoryTheme, VictoryChart, VictoryLine, VictoryAxis } from 'victory-native';

import WmLineChartProps from './line-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLineChartStyles } from './line-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";

export class WmLineChartState extends BaseChartComponentState<WmLineChartProps> {}

export default class WmLineChart extends BaseChartComponent<WmLineChartProps, WmLineChartState, WmLineChartStyles> {

  constructor(props: WmLineChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLineChartProps());
  }

  renderWidget(props: WmLineChartProps) {
    return (<VictoryChart
      theme={VictoryTheme.material}
    >
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} />
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryLine key={props.name + '_' + i}
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
