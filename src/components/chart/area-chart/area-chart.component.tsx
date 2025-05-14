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
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmAreaChartState extends BaseChartComponentState<WmAreaChartProps> {
  chartWidth = 0;
}

export default class WmAreaChart extends BaseChartComponent<WmAreaChartProps, WmAreaChartState, WmAreaChartStyles> {

  constructor(props: WmAreaChartProps) {
    super(props, DEFAULT_CLASS, new WmAreaChartProps(), new WmAreaChartState());
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;

    this.handleLayout(e);

    this.updateState({
      chartWidth: viewWidth
    } as WmAreaChartState)
  }

  onSelect(event: any, data: any){
    if (!this.viewRef.current) return;
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
    } as WmAreaChartState)
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  });
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
        {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
        style={this.styles.root}
        onLayout={this.onViewLayoutChange.bind(this)}
        key={`${props.title}_area_chart`}
      >
        <View>
        { (props.title || props.iconclass) ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
            {props.title ? (<Text style={this.styles.title}>{props.title}</Text>) : null }
          </View>
        ) : null }
          { props.subheading? (
          <Text style={this.styles.subHeading}>{props.subheading}</Text> ) : null }
        </View>
        {this.state.chartWidth ? 
        (
          <View ref={this.viewRef}>
          {this.getTooltip()}
          <VictoryChart
            theme={this.state.theme}
            height={this.styles.root.height as number}
            width={this.state.chartWidth || 120}
            padding={{ top: props.offsettop, bottom: props.offsetbottom, left: props.offsetleft, right: props.offsetright }}
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
                    name={props.name + '_' + i}
                    style={{
                      data: {
                        fill: `url(#${chartName}Gradient${i})`,
                        stroke: this.state.colors[i],
                        strokeWidth: props.linethickness,
                      }
                    }}
                    data={this.isRTL?d.toReversed():d}
                  />
                    <VictoryScatter
                      size={5}
                      key={props.name + '_scatter' + i}
                      style={{
                        data: props.highlightpoints ? {fill: this.state.colors[i], opacity: 0.8}:{opacity: 0}
                      }}        
                      data={this.isRTL?d.toReversed():d}
                      events={[{
                        target: 'data',
                        eventHandlers: Platform.OS == "web" ? {
                          onClick: this.onSelect.bind(this)
                        }:{
                          onPress: this.onSelect.bind(this)
                        }
                      }]}
                      />
                </VictoryGroup>
              })
            }
            </VictoryStack>
          </VictoryChart>
          </View>
        )
      : null}
    </View>);
  }
}
