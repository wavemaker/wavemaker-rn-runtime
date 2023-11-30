import React from 'react';
import { LayoutChangeEvent, View, Text } from 'react-native';
import { Defs, LinearGradient, Stop, Svg } from 'react-native-svg';
import { VictoryArea, VictoryLine, VictoryChart, VictoryLegend, VictoryStack, VictoryScatter, VictoryGroup } from "victory-native";
import { InterpolationPropType } from 'victory-core';
import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export class WmAreaChartState extends BaseChartComponentState<WmAreaChartProps> {
  chartWidth = 0;
}

export default class WmAreaChart extends BaseChartComponent<WmAreaChartProps, WmAreaChartState, WmAreaChartStyles> {

  constructor(props: WmAreaChartProps) {
    super(props, DEFAULT_CLASS, new WmAreaChartProps(), new WmAreaChartState());
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;
    this.updateState({
      chartWidth: viewWidth
    } as WmAreaChartState)
  }

  renderWidget(props: WmAreaChartProps) {
    if (!this.state.data?.length) {
      return null;
    }
    let mindomain={
      x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined,
      y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined
    };
    const chartName = this.props.name ?? 'nonameAreachart';
    return (
      <View
        style={this.styles.root}
        onLayout={this.onViewLayoutChange.bind(this)}
      >
        {this.state.chartWidth ? 
        (
          <VictoryChart
            theme={this.state.theme}
            height={this.styles.root.height as number}
            width={this.state.chartWidth || 120}
            padding={{ top: 70, bottom: 50, left: 50, right: 30 }}
            minDomain={mindomain}
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
            <VictoryStack>
            {
              this.state.data.map((d: any, i: number) => {
                return <VictoryGroup key={props.name + '_area_group_' + i}>
                  <Defs>
                    <LinearGradient id={`${chartName}Gradient${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <Stop offset="0%" stopColor={this.state.colors[i]}/>
                      <Stop offset="100%" stopColor={'#ffffff00'} stopOpacity="0"/>
                    </LinearGradient>
                  </Defs>
                  <VictoryArea
                    interpolation={props.interpolation as InterpolationPropType}
                    key={props.name + '_' + i}
                    style={{
                      data: {
                        fill: `url(#${chartName}Gradient${i})`,
                        stroke: 'green',
                        strokeWidth: 5,
                      }
                    }}
                    data={d}
                  />
                  {props.highlightpoints || this.state.data.length === 1?
                    <VictoryScatter
                      size={5}
                      key={props.name + '_scatter' + i}
                      style={{
                        data: { fill: 'black', opacity: 0.8}
                      }}        
                      data={d}
                      />
                  : null}
                </VictoryGroup>
              })
            }
            </VictoryStack>
          </VictoryChart>
        )
      : null}
    </View>);
  }
}
