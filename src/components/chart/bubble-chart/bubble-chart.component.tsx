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

export default class WmBubbleChart extends BaseChartComponent<WmBubbleChartProps, WmBubbleChartState, WmBubbleChartStyles> {

  constructor(props: WmBubbleChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmBubbleChartProps(), new WmBubbleChartState());
  }

  renderWidget(props: WmBubbleChartProps) {
    if (!this.state.data?.length) {
      return null;
    }
    return (<View
      style={this.styles.root}
    >
      <VictoryChart
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
          title={[props.title, props.subheading]}
          orientation="horizontal"
          gutter={20}
          data={[]}
          theme={this.state.theme}
        />
        {this.getLegendView()}
        {this.getXaxis()}
        {this.getYAxis()}
        {this.state.data.map((d: any, i: number) => {
        return <VictoryScatter
          colorScale={this.state.colors}
          animate={{
            onLoad: {
              duration: 5000,
              before: () => ({ opacity: 0.3 }),
              after: () => ({ opacity: 1 })
            }
          }}
          style={{
            data: { fill: this.state.colors[i], opacity: ({ datum }) => datum.opacity }
          }}
          key={props.name + '_bubble_' + i}
          name={props.name + '_bubble_' + i}
          data={d}
          size={5}
        />
      })}
      </VictoryChart></View>);
  }
}
