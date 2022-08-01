import React from 'react';
import {VictoryAxis, VictoryArea, VictoryTheme, VictoryChart} from "victory-native";

import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";

export class WmAreaChartState extends BaseChartComponentState<WmAreaChartProps> {}

export default class WmAreaChart extends BaseChartComponent<WmAreaChartProps, WmAreaChartState, WmAreaChartStyles> {

  constructor(props: WmAreaChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAreaChartProps(), new WmAreaChartState());
  }

  renderWidget(props: WmAreaChartProps) {
    return (<VictoryChart
      theme={VictoryTheme.material}
    >
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} />
      <VictoryAxis crossAxis style={{ grid: { stroke: '#ccc', strokeWidth: 0.5 } }} dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryArea key={props.name + '_' + i}
                              style={{
                                data: {
                                  fill: "#c43a31", fillOpacity: 0.5, stroke: "#c43a31", strokeWidth: 3
                                }
                              }}
                             data={d}
          />
        })
      }
    </VictoryChart>);
  }
}
