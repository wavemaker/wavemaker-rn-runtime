import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmBubbleChartProps from './bubble-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmBubbleChartStyles } from './bubble-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import {VictoryChart, VictoryScatter} from "victory-native";
import { ScatterSymbolType } from "victory-core";
import {Svg} from "react-native-svg";

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
    if (!this.state.data.length) {
      return null;
    }
    return (<View
      style={this.styles.root}
    >
      <VictoryChart
        containerComponent={<Svg />}
        theme={this.state.theme}
        height={this.chartHeight}
        width={this.chartWidth}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
        padding={{ top: 70, bottom: 50, left: 50, right: 50 }}
      >
      </VictoryChart></View>);
  }
}
