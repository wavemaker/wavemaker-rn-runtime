import React from 'react';
import { View } from 'react-native';
import { Svg } from 'react-native-svg';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryScatter,
  VictoryGroup
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
      return null;
    }
    const icon = (<WmIcon
       name={props.name + '_icon'} iconclass={"wi wi-line-chart"}></WmIcon>);
    return (<View
      style={this.styles.root}
    >
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
          y={0}
          dataComponent={<WmIcon
            styles = {{fontSize: 50}} name={props.name + '_icon'} iconclass={"wi wi-star"}></WmIcon>}
        />
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
            data={d}
          />
          {(props.highlightpoints || this.state.data.length === 1) ?
            <VictoryScatter size={5} key={props.name + '_scatter' + i}
                            style={{
                              data: { fill: this.state.colors[i], opacity: 0.8}
                            }}
                            data={d}
            />: null}</VictoryGroup>
        })
      }
    </VictoryChart>
    </View>);
  }
}
