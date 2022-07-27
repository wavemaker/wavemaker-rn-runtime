import React from 'react';
import { View, Image } from 'react-native';
import { Svg } from 'react-native-svg';

import { VictoryTheme, VictoryChart, VictoryLine, VictoryAxis, VictoryLegend, VictoryArea, VictoryStack } from 'victory-native';

import WmLineChartProps from './line-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmLineChartStyles } from './line-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

export class WmLineChartState extends BaseChartComponentState<WmLineChartProps> {}

export default class WmLineChart extends BaseChartComponent<WmLineChartProps, WmLineChartState, WmLineChartStyles> {

  constructor(props: WmLineChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLineChartProps());
  }

  renderWidget(props: WmLineChartProps) {
    return (<View
      style={this.styles.root}
    >
      <VictoryChart
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
          centerTitle
          orientation="horizontal"
          gutter={20}
          data={this.state.legendData}
          x={125}
          itemsPerRow={3}
        />
        {/* x axis with vertical lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} label={(props.xaxislabel || this.props.xaxisdatakey) + (props.xunits ? `(${props.xunits})` : '')} />
        {/* y axis with horizontal lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} style={{axisLabel: {padding: props.yaxislabeldistance}}}
                   label={(props.yaxislabel || this.props.yaxisdatakey) + (props.yunits ? `(${props.yunits})` : '')}
                   dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryLine key={props.name + '_line_' + i}
                              name={props.name + '_line_' + i}
                              style={{
                                data: {stroke: (this.state.colors[i] || ThemeVariables.chartLineColor)}
                              }}
            data={d}
          />
        })
      }
    </VictoryChart>
    </View>);
  }
}
