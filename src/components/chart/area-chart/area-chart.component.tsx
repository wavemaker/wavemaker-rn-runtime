import React from 'react';
import { VictoryArea, VictoryChart, VictoryLegend, VictoryStack, VictoryScatter, VictoryGroup } from "victory-native";
import { InterpolationPropType } from 'victory-core';
import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import { Svg } from "react-native-svg";
import { View } from "react-native";

export class WmAreaChartState extends BaseChartComponentState<WmAreaChartProps> {}

export default class WmAreaChart extends BaseChartComponent<WmAreaChartProps, WmAreaChartState, WmAreaChartStyles> {

  constructor(props: WmAreaChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmAreaChartProps(), new WmAreaChartState());
  }

  renderWidget(props: WmAreaChartProps) {
    if (!this.state.data?.length) {
      return null;
    }
    let mindomain={x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined, y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined};
    return (
      <View
      style={this.styles.root}
    ><VictoryChart
      theme={this.state.theme}
      height={this.styles.root.height as number}
      width={this.styles.root.width as number || this.screenWidth}
      animate={{
        duration: 2000,
        onLoad: { duration: 1000 }
      }}
      padding={{ top: 70, bottom: 50, left: 50, right: 50 }}
      minDomain={mindomain}
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
      {this.getLegendView()}
      {this.getXaxis()}
      {this.getYAxis()}
      <VictoryStack>
      {
        this.state.data.map((d: any, i: number) => {
          return <VictoryGroup key={props.name + '_area_group_' + i}>
            <VictoryArea interpolation={props.interpolation as InterpolationPropType} key={props.name + '_' + i}
                              style={{
                                data: {
                                  fill: this.state.colors[i], stroke: this.state.colors[i]
                                }
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
      </VictoryStack>
    </VictoryChart></View>);
  }
}
