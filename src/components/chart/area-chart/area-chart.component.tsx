import React from 'react';
import {VictoryAxis, VictoryArea, VictoryChart, VictoryLegend, VictoryStack} from "victory-native";

import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import {Svg} from "react-native-svg";

export class WmAreaChartState extends BaseChartComponentState<WmAreaChartProps> {}

export default class WmAreaChart extends BaseChartComponent<WmAreaChartProps, WmAreaChartState, WmAreaChartStyles> {

  constructor(props: WmAreaChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAreaChartProps(), new WmAreaChartState());
  }

  renderWidget(props: WmAreaChartProps) {
    return (<VictoryChart
      containerComponent={<Svg />}
      theme={this.state.theme}
      height={this.styles.root.height as number}
      width={this.styles.root.width as number || this.screenWidth}
      animate={{
        duration: 2000,
        onLoad: { duration: 1000 }
      }}
      padding={{ top: 70, bottom: 50, left: 50, right: 50 }}
    >
      <VictoryLegend
        name={'legend'}
        containerComponent={<Svg />}
        title={props.title}
        orientation="horizontal"
        gutter={20}
        data={[]}
        theme={this.state.theme}
      />
      <VictoryLegend
        name={'legendData'}
        orientation="horizontal"
        gutter={20}
        data={this.state.legendData}
        style={{ border: { stroke: 'none' } }}
        borderPadding={{top: 30, left: 50}}
      />
      {/* x axis with vertical lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} label={(props.xaxislabel || this.props.xaxisdatakey) + (props.xunits ? `(${props.xunits})` : '')} />
      {/* y axis with horizontal lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} style={{axisLabel: {padding: props.yaxislabeldistance}}}
                   label={(props.yaxislabel || this.props.yaxisdatakey) + (props.yunits ? `(${props.yunits})` : '')}
                   dependentAxis />
      <VictoryStack>
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryArea key={props.name + '_' + i}
                              style={{
                                data: {
                                  fill: this.state.colors[i], stroke: this.state.colors[i]
                                }
                              }}
                             data={d}
          />
        })
      }
      </VictoryStack>
    </VictoryChart>);
  }
}