import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmBubbleChartProps from './bubble-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmBubbleChartStyles } from './bubble-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import {VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryScatter} from "victory-native";
import { ScatterSymbolType } from "victory-core";
import {Svg} from "react-native-svg";
import {get} from "lodash-es";

export class WmBubbleChartState extends BaseChartComponentState<WmBubbleChartProps> {}

const shapes: {[key: string]: ScatterSymbolType} = {
  'circle': 'circle',
  'cross': 'cross',
  'diamond': 'diamond',
  'plus': 'plus',
  'minus': 'minus',
  'square': 'square',
  'star': 'star',
  'triangle-down': 'triangleDown',
  'triangle-up': 'triangleUp'
};

export default class WmBubbleChart extends BaseChartComponent<WmBubbleChartProps, WmBubbleChartState, WmBubbleChartStyles> {

  constructor(props: WmBubbleChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmBubbleChartProps(), new WmBubbleChartState());
  }

  renderWidget(props: WmBubbleChartProps) {
    let chartHeight = this.chartHeight || 250;
    let chartWidth = this.chartWidth || this.screenWidth;
    const legendHeight = 60 || props.legendheight;
    const pChartHeight = chartHeight + legendHeight;
    if (!this.state.data?.length) {
      return null;
    }
    return (<View
      style={[this.styles.root, {height: pChartHeight}]}
    >
      <VictoryChart
        containerComponent={<Svg />}
        theme={this.state.theme}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
        padding={{ top: 70, bottom: 50, left: 50, right: 50 }}
      >
        <VictoryLegend
          name={'legend'}
          theme={this.state.theme}
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
        {this.state.data.map((d: any, i: number) => {
        return <VictoryScatter
          key={props.name + '_bubble_' + i}
          name={props.name + '_bubble_' + i}
          bubbleProperty={props.bubblesize}
          data={d}
        />
      })}
      </VictoryChart></View>);
  }
}
