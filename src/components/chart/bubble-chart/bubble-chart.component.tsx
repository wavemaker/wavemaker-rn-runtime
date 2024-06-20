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

export class WmBubbleChartState extends BaseChartComponentState<WmBubbleChartProps> {}

export default class WmBubbleChart extends BaseChartComponent<WmBubbleChartProps, WmBubbleChartState, WmBubbleChartStyles> {

  constructor(props: WmBubbleChartProps) {
    super(props, DEFAULT_CLASS, new WmBubbleChartProps(), new WmBubbleChartState());
  }

  onSelect(event: any, data: any){
    let value = data.data[data.index].y;
    let label = this.state.xaxisDatakeyArr[data.datum.x];
    let selectedItem = this.props.dataset[data.index];
    const nativeEvent = event.nativeEvent;
    this.setTooltipPosition(nativeEvent);
    let selectedChartItem = [{series: 0, x: data.index, y: value,_dataObj: selectedItem},data.index];
    this.updateState({
      tooltipXaxis: label,
      tooltipYaxis: value,
      isTooltipOpen: true,
      selectedItem: {...selectedItem, index: data.index},
    } as WmBubbleChartState)
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  }

  renderWidget(props: WmBubbleChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data?.length) {
      return null;
    }
    return (<View
      {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
      style={this.styles.root}
    >
      {this.getTooltip()}
      <VictoryChart
        theme={this.state.theme}
        height={this.styles.root.height as number}
        width={this.styles.root.width as number || this.screenWidth}
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
      </VictoryChart></View>);
  }
}
