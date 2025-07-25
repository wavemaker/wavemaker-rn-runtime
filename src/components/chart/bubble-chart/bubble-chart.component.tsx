import React from 'react';
import {Text, View, Platform} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 

import WmBubbleChartProps from './bubble-chart.props';
import { DEFAULT_CLASS, WmBubbleChartStyles } from './bubble-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import {VictoryAxis, VictoryChart, VictoryLegend, VictoryLine, VictoryScatter} from "victory-native";
import { ScatterSymbolType } from "victory-core";
import {Svg} from "react-native-svg";
import {get} from "lodash-es";
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmBubbleChartState extends BaseChartComponentState<WmBubbleChartProps> {}

export default class WmBubbleChart extends BaseChartComponent<WmBubbleChartProps, WmBubbleChartState, WmBubbleChartStyles> {

  constructor(props: WmBubbleChartProps) {
    super(props, DEFAULT_CLASS, new WmBubbleChartProps(), new WmBubbleChartState());
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
    } as WmBubbleChartState)
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  });
  }

  renderWidget(props: WmBubbleChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data?.length) {
      return null;
    }
    return (<View
      {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
      style={this.styles.root}
      onLayout={this.onViewLayoutChange.bind(this)}
    >
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
          <Text style={this.styles.title}>{props.title}</Text>
        </View>
        <Text style={this.styles.subHeading}>{props.subheading}</Text>
      </View>
      <View ref={this.viewRef}>
      {this.getTooltip()}
      <VictoryChart
        theme={this.state.theme}
        height={this.styles.root.height as number}
        width={this.state.chartWidth || this.screenWidth}
        padding={{ top: props.offsettop, bottom: props.offsetbottom, left: this.isRTL ? props.offsetright : props.offsetleft, right: this.isRTL ? props.offsetleft : props.offsetright }}
      >
        <VictoryLegend
          name={'legend'}
          containerComponent={<Svg />}
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
          style={{
            data: { fill: this.state.colors[i], opacity: ({ datum }: any) => datum.opacity }
          }}
          key={props.name + '_bubble_' + i}
          name={props.name + '_bubble_' + i}
          data={d}
          size={5}
          events={[{
            target: 'data',
            eventHandlers: Platform.OS == "web" ? {
              onClick: this.onSelect.bind(this)
            }:{
              onPress: this.onSelect.bind(this)
            }
          }]}
        />
      })}
      </VictoryChart></View></View>);
  }
}
