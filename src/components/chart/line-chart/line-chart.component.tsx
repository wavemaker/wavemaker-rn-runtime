import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg';

import { VictoryChart, VictoryLine, VictoryAxis, VictoryLegend, VictoryScatter, VictoryGroup } from 'victory-native';

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
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmLineChartProps(), new WmLineChartState());
  }

  renderWidget(props: WmLineChartProps) {
    if (!this.state.data?.length) {
      return null;
    }
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
      padding={{ top: props.offsettop, bottom: props.offsetbottom, left: props.offsetleft, right: props.offsetright }}
    >
        <VictoryLegend
          name={'legend'}
          containerComponent={<Svg />}
          title={props.title}
          orientation="horizontal"
          gutter={20}
          data={[]}
          theme={this.state.theme}
          y={0}
        />
        {props.showlegend === 'hide' ? null : this.getLegendView(props.showlegend)}
        {/* x axis with vertical lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} label={(props.xaxislabel || this.props.xaxisdatakey) + (props.xunits ? `(${props.xunits})` : '')} />
        {/* y axis with horizontal lines having grid stroke colors*/}
      <VictoryAxis crossAxis theme={this.state.theme} style={{axisLabel: {padding: props.yaxislabeldistance}}}
                   label={(props.yaxislabel || this.props.yaxisdatakey) + (props.yunits ? `(${props.yunits})` : '')}
                   tickFormat={(t) => `${this.abbreviateNumber(t)}`}
                   fixLabelOverlap={true}
                   dependentAxis />
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryGroup><VictoryLine key={props.name + '_line_' + i}
                              name={props.name + '_line_' + i}
                              style={{
                                data: {
                                  stroke: (this.state.colors[i] || ThemeVariables.chartLineColor),
                                  strokeWidth: props.linethickness}
                              }}
            data={d}
          />
          {props.highlightpoints ?
            <VictoryScatter size={5} key={props.name + '_scatter' + i}
                            animate={{
                              onLoad: {
                                duration: 2000,
                                before: () => ({ opacity: 0.3 }),
                                after: () => ({ opacity: 1 })
                              }
                            }}
                            style={{
                              data: { fill: this.state.colors[i], opacity: 0.8}
                            }}
                            data={d}
            />: null}</VictoryGroup>
        })
      }
    </VictoryChart>
    </View>);
  }
}
