import React from 'react';
import { View } from 'react-native';

import {
  VictoryAxis,
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryStack,
  VictoryGroup
} from "victory-native";

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

  getBarChart(props: WmBarChartProps) {
  return this.state.data.map((d: any, i: number) => {
    return <VictoryBar key={props.name + '_' + i}
        horizontal={props.horizontal}
        data={d}
        height={100}
        />
    });
}

  renderWidget(props: WmBarChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    return (<VictoryChart theme={this.state.theme}
                          height={this.styles.root.height as number}
                          width={this.styles.root.width as number || this.screenWidth}
                          animate={{
                            duration: 2000,
                            onLoad: { duration: 1000 }
                          }}
                          padding={{ top: 70, bottom: 50, left: 50, right: 50 }}>
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
      {
        props.viewtype === 'Stacked' ? <VictoryStack colorScale={this.state.colors}>
          {
            this.getBarChart(props)
          }
        </VictoryStack> : <VictoryGroup colorScale={this.state.colors} offset={5}>
          {
            this.getBarChart(props)
          }
        </VictoryGroup>
      }
    </VictoryChart>);
  }
}
