import React from 'react';
import { View, Text, Platform } from 'react-native';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import {
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
import { DEFAULT_CLASS, WmBarChartStyles } from './bar-chart.styles';
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";
import { min } from 'moment';

export class WmBarChartState extends BaseChartComponentState<WmBarChartProps> {}

export default class WmBarChart extends BaseChartComponent<WmBarChartProps, WmBarChartState, WmBarChartStyles> {

  constructor(props: WmBarChartProps) {
    super(props, DEFAULT_CLASS, new WmBarChartProps(), new WmBarChartState());
  }

  labelFn(data: any): string | number | string[] | number[] | null {
    return this.abbreviateNumber(data.datum.y);
  }

  getBarChart(props: WmBarChartProps) {
  return this.state.data.map((d: any, i: number) => {
    return <VictoryBar key={props.name + '_' + i}
        horizontal={props.horizontal} labels={props.showvalues ? this.labelFn.bind(this) : undefined}
        data={this.isRTL?d.toReversed():d}
        height={100}
        alignment='start'
        style={props.customcolors?{
          data: {
            fill: ({ datum }) => this.state.colors[datum.x] ?? this.state.colors[datum.x % this.state.colors.length]
          }
        }:{}}
        cornerRadius={{topLeft: this.styles.bar.borderTopLeftRadius, topRight: this.styles.bar.borderTopRightRadius, bottomLeft: this.styles.bar.borderBottomLeftRadius, bottomRight: this.styles.bar.borderBottomRightRadius}}
        events={[{
          target: 'data',
          eventHandlers: Platform.OS == "web" ? {
            onClick: this.onSelect.bind(this)
          }:{
            onPress: this.onSelect.bind(this)
          }
        }]}/>
    });
}

onSelect(event: any, data: any){
  let value = data.data[data.index].y;
  let label = this.state.xaxisDatakeyArr[data.datum.x];
  let selectedItem = this.props.dataset[data.index];
  let selectedChartItem = [{series: 0, x: data.index, y: value,_dataObj: selectedItem},data.index];
  this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
}

  renderWidget(props: WmBarChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data.length) {
      return null;
    }
    let mindomain={x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined, y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined};
    return (<View
      {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
      style={this.styles.root}
    >
      <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
            <Text style={this.styles.title}>{props.title}</Text>
          </View>
          <Text style={this.styles.subHeading}>{props.subheading}</Text>
        </View>
      <VictoryChart theme={this.state.theme}
                          height={this.styles.root.height as number}
                          width={this.styles.root.width as number || this.screenWidth}               
                          minDomain={mindomain}
                          padding={{ top: props.offsettop, bottom: props.offsetbottom, left: props.offsetleft, right: props.offsetright }}
                          containerComponent={
                            this.getTooltip(props)
                          }>
      {this.getLegendView()}
      {this.getXaxis()}
      {this.getYAxis()}
      {
        props.viewtype === 'Stacked' ? <VictoryStack colorScale={this.state.colors}>
          {
            this.getBarChart(props)
          }
        </VictoryStack> : <VictoryGroup colorScale={this.state.colors}  offset={10} >
          {
            this.getBarChart(props)   
          }
        </VictoryGroup>
      }
    </VictoryChart></View>);
  }
}
