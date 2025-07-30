import React from 'react';
import { Text, View, Platform, LayoutChangeEvent } from 'react-native';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryGroup,
} from 'victory-native';

import WmLineChartProps from './line-chart.props';
import { DEFAULT_CLASS, WmLineChartStyles } from './line-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import {InterpolationPropType} from "victory-core";
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

export class WmLineChartState extends BaseChartComponentState<WmLineChartProps> {}

export default class WmLineChart extends BaseChartComponent<WmLineChartProps, WmLineChartState, WmLineChartStyles> {

  constructor(props: WmLineChartProps) {
    super(props, DEFAULT_CLASS, new WmLineChartProps(), new WmLineChartState());
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
    } as WmLineChartState)
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  });
  }



  renderWidget(props: WmLineChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data?.length) {
      return null;
    }
    return (
    <View style={this.styles.root} {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)} onLayout={this.onViewLayoutChange}>
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
        height={(this.styles.root.height) as number}
        width={this.state.chartWidth || this.screenWidth}
        padding={{ top: props.offsettop, bottom: props.offsetbottom, left: this.isRTL ? props.offsetright : props.offsetleft, right: this.isRTL ? props.offsetleft : props.offsetright }}
      >
        {this.getLegendView()}
        {this.getXaxis()}
        {this.getYAxis()}
        {this.state.data.map((d: any, i: number) => {
          return <VictoryGroup key={props.name + '_line_group_' + i}>
            <VictoryLine interpolation={props.interpolation as InterpolationPropType}  key={props.name + '_line_' + i}
              name={props.name + '_' + i}
              standalone={true}
              style={{
                data: {
                  stroke: (this.state.colors[i] || ThemeVariables.INSTANCE.chartLineColor),
                  strokeWidth: props.linethickness,
                }
              }}       
              data={d}
            />
          
              <VictoryScatter size={5} key={props.name + '_scatter' + i}
                  style={{
                    data: (props.highlightpoints || this.state.data.length === 1) ? {fill: this.state.colors[i], opacity: 0.8} : {opacity:0}
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
            </VictoryGroup>
        })}
      </VictoryChart>
      </View>
    </View>);
  }
}
