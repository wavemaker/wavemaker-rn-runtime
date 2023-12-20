import React from 'react';
import Color from "color";
import { LayoutChangeEvent, View, Text, Platform } from 'react-native';
import { Defs, LinearGradient, Stop, Svg } from 'react-native-svg';
import { VictoryArea, VictoryLine, VictoryChart, VictoryLegend, VictoryStack, VictoryScatter, VictoryGroup } from "victory-native";
import { InterpolationPropType } from 'victory-core';
import WmAreaChartProps from './area-chart.props';
import { DEFAULT_CLASS, WmAreaChartStyles } from './area-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";

import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { isNil, isNumber } from 'lodash-es';

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

  onSelect(event: any, data: any){
    let value = data.data[data.index].y;
    let label = this.state.xaxisDatakeyArr[data.datum.x];
    let selectedItem = this.props.dataset[data.index];
    let selectedChartItem = [{series: 0, x: data.index, y: value,_dataObj: selectedItem},data.index];
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  }

  renderWidget(props: WmAreaChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data?.length) {
      return null;
    }
    let mindomain={
      x: props.xdomain === 'Min' ? this.state.chartMinX: undefined,
      y: props.ydomain === 'Min' ? this.state.chartMinY: undefined
    };
    const chartName = this.props.name ?? 'nonameAreachart';
    let gradientStop = '100%';
    if (isNumber(this.state.chartMaxY) && isNumber(this.state.chartMinY) && this.state.chartMaxY > 0) {
      gradientStop = (this.state.chartMaxY - this.state.chartMinY) * 100 / this.state.chartMaxY + '%';
    }
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
            padding={{ top: 70, bottom: 50, left: 50, right: 30 }}
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
                      <Stop offset="0%" stopColor={Color(this.state.colors[i]).lighten(0.2).rgb().toString()}/>
                      <Stop offset={gradientStop} stopColor={Color(this.state.colors[i]).lighten(0.6).rgb().toString()}/>
                    </LinearGradient>
                  </Defs>
                  <VictoryArea
                    interpolation={props.interpolation as InterpolationPropType}
                    key={props.name + '_' + i}
                    style={{
                      data: {
                        fill: `url(#${chartName}Gradient${i})`,
                        stroke: this.state.colors[i],
                        strokeWidth: props.linethickness,
                      }
                    }}
                    data={d}
                  />
                  {props.highlightpoints ?
                    <VictoryScatter
                      size={5}
                      key={props.name + '_scatter' + i}
                      style={{
                        data: { 
                          fill: Color(this.state.colors[i]).darken(0.2).rgb().toString()}
                      }}        
                      data={d}
                      events={[{
                        target: 'data',
                        eventHandlers: Platform.OS == "web" ? {
                          onClick: this.onSelect.bind(this)
                        }:{
                          onPress: this.onSelect.bind(this)
                        }
                      }]}
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
