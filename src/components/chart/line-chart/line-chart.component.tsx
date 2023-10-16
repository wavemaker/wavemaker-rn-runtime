import React from 'react';
import { Text, View } from 'react-native';
import { Svg } from 'react-native-svg';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryScatter,
  VictoryGroup,
  VictoryLabel
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

  renderWidget(props: WmLineChartProps) {
    if (!this.state.data?.length) {
      <VictoryLine/>
    }
    return (<View
      style={this.styles.root}
    >
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
    >     
        {this.getLegendView()}
        {this.getXaxis()}
        {this.getYAxis()}
        {
        this.state.data.map((d: any, i: number) => {
          return <VictoryGroup key={props.name + '_line_group_' + i}>
            <VictoryLine interpolation={props.interpolation as InterpolationPropType}  key={props.name + '_line_' + i}
                              name={props.name + '_line_' + i}
                              standalone={true}
                              style={{
                                data: {
                                  stroke: (this.state.colors[i] || ThemeVariables.INSTANCE.chartLineColor),
                                  strokeWidth: props.linethickness}
                              }}
            data={this.isRTL?d.toReversed():d}
          />
          {(props.highlightpoints || this.state.data.length === 1) ?
            <VictoryScatter size={5} key={props.name + '_scatter' + i}
                            style={{
                              data: { fill: this.state.colors[i], opacity: 0.8}
                            }}
                            data={this.isRTL?d.toReversed():d}
            />: null}</VictoryGroup>
        })
      }
    </VictoryChart>
    </View>);
  }
}
