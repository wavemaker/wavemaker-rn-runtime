import React from 'react';
import { Text, View, Platform } from 'react-native';
import { Svg } from 'react-native-svg';

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

export class WmLineChartState extends BaseChartComponentState<WmLineChartProps> {}

export default class WmLineChart extends BaseChartComponent<WmLineChartProps, WmLineChartState, WmLineChartStyles> {

  constructor(props: WmLineChartProps) {
    super(props, DEFAULT_CLASS, new WmLineChartProps(), new WmLineChartState());
  }
  
  onSelect(event: any, data: any){
    let value = data.data[data.index].y;
    let label = this.state.xaxisDatakeyArr[data.datum.x];
    let selectedItem = this.props.dataset[data.index];
    let selectedChartItem = [{series: 0, x: data.index, y: value,_dataObj: selectedItem},data.index];
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  }

  renderWidget(props: WmLineChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data?.length) {
      return null;
    }
    return (
    <View style={this.styles.root}>
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
          <Text style={this.styles.title}>{props.title}</Text>
        </View>
        <Text style={this.styles.subHeading}>{props.subheading}</Text>
      </View>
      <VictoryChart
        theme={this.state.theme}
        height={this.styles.root.height as number}
        width={this.styles.root.width as number || this.screenWidth}
        padding={{ top: props.offsettop, bottom: props.offsetbottom, left: props.offsetleft, right: props.offsetright }}
        containerComponent={
          this.getTooltip(props)
        }
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
          {(props.highlightpoints || this.state.data.length === 1) ?
              <VictoryScatter size={5} key={props.name + '_scatter' + i}
                  style={{
                    data: { fill: this.state.colors[i], opacity: 0.8,}
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
              />: null}
            </VictoryGroup>
        })}
      </VictoryChart>
    </View>);
  }
}
