import React from 'react';
import { View, Text, Platform, LayoutChangeEvent } from 'react-native';
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
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmBarChartState extends BaseChartComponentState<WmBarChartProps> {}

export default class WmBarChart extends BaseChartComponent<WmBarChartProps, WmBarChartState, WmBarChartStyles> {

  constructor(props: WmBarChartProps) {
    super(props, DEFAULT_CLASS, new WmBarChartProps(), new WmBarChartState());
  }

  labelFn(data: any): string | number | string[] | number[] | null {
    return this.abbreviateNumber(data.datum.y);
  }

  getBarChart(props: WmBarChartProps) {
    const isNested = Array.isArray(this.state.data[0]) && this.state.data.length > 1;
  return this.state.data.map((d: any, i: number) => {
    return <VictoryBar key={props.name + '_' + i}
        horizontal={props.horizontal} labels={props.showvalues ? this.labelFn.bind(this) : undefined}
        data={this.isRTL?d.toReversed():d}
        height={100}
        alignment={this.isRTL ? 'end' : 'start'}
        style={props.customcolors?{
          data: {
            fill:isNested ? this.state.colors[i % this.state.colors.length] : ({ datum }) => this.state.colors[datum.x] ?? this.state.colors[datum.x % this.state.colors.length]
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
        }]}
        {...(props.barwidth ? { barWidth: props.barwidth } : {})} />
    });
  }

onSelect(event: any, data: any){
  if (!this.viewRef.current) return;
  if (!this.state.props.dataset) return;
  this.viewRef.current.measureInWindow((chartX: number, chartY: number) => {
  let value = data.data[data.index].y;
  let label = this.state.xaxisDatakeyArr[data.datum.x];
  let selectedItem = this.props.dataset[data.index];
  const nativeEvent = event.nativeEvent;
  let tooltipX = nativeEvent.pageX - chartX;
  let tooltipY = nativeEvent.pageY - chartY;
    let selectedChartItem = [{series: 0, x: data.index, y: value,_dataObj: selectedItem},data.index];
    this.updateState({
      tooltipXaxis: label,
      tooltipYaxis: value,
      isTooltipOpen: true,
      selectedItem: {...selectedItem, index: data.index},
      tooltipXPosition: tooltipX - this.state.tooltipoffsetx, 
      tooltipYPosition: tooltipY - this.state.tooltipoffsety
    } as WmBarChartState)
  this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  });
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
      onLayout={this.onViewLayoutChange.bind(this)}
    >
      <View>
      { (props.title || props.iconclass) ? (
        <View testID="title-icon-container" style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
          {props.title ? (<Text style={this.styles.title}>{props.title}</Text>) : null }
        </View>
      ) : null }
        { props.subheading ? (
          <Text style={this.styles.subHeading}>{props.subheading}</Text> ) : null }
        </View>
      <View ref={this.viewRef}>
      {this.getTooltip()}
      <VictoryChart theme={this.state.theme}
                          height={(this.styles.root.height) as number}
                          width={this.state.chartWidth || this.screenWidth}
                          minDomain={mindomain}
                          padding={{ top: props.offsettop, bottom: props.offsetbottom, left: this.isRTL ? props.offsetright : props.offsetleft, right: this.isRTL ? props.offsetleft : props.offsetright }}>
      {this.getLegendView()}
      {this.getXaxis()}
      {this.getYAxis()}
      {
        props.viewtype === 'Stacked' ? <VictoryStack 
        colorScale={!this.theme ? this.state.colors : undefined}>
          {
            this.getBarChart(props)
          }
        </VictoryStack> : <VictoryGroup colorScale={!this.theme ? this.state.colors : undefined}  offset={10} >
          {
            this.getBarChart(props)   
          }
        </VictoryGroup>
      }
    </VictoryChart></View></View>);
  }
}
