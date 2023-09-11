import React from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { Defs, LinearGradient, Stop, Svg } from 'react-native-svg';
import { VictoryArea, VictoryChart, VictoryLegend, VictoryStack, VictoryScatter, VictoryGroup } from "victory-native";
import { InterpolationPropType } from 'victory-core';
import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";


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
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
            <Text style={this.styles.title}>{props.title}</Text>
          </View>
          <Text style={this.styles.subHeading}>{props.subheading}</Text>
        </View>
        {this.state.chartWidth ? 
        (
          <VictoryChart
            theme={this.state.theme}
            height={this.styles.root.height as number}
            width={this.state.chartWidth || 120}
            padding={{ top: 70, bottom: 50, left: 50, right: 50 }}
            minDomain={mindomain}
          > 
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
                        stroke: this.state.colors[i]
                      }
                    }}
                    data={d}
                  />
                  {props.highlightpoints ?
                    <VictoryScatter
                      size={5}
                      key={props.name + '_scatter' + i}
                      style={{
                        data: { fill: this.state.colors[i], opacity: 0.8}
                      }}
                      data={d}/>
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
