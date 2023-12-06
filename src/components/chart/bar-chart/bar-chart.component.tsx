import React from 'react';
import { View } from 'react-native';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils'; 

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
import { Svg } from "react-native-svg";

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
        data={d}
        height={100}
        />
    });
}

  renderWidget(props: WmBarChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    let mindomain={x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined, y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined};
    return (<View
      {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
      style={this.styles.root}
    ><VictoryChart theme={this.state.theme}
                          height={this.styles.root.height as number}
                          width={this.styles.root.width as number || this.screenWidth}
                          minDomain={mindomain}
                          padding={{ top: props.offsettop, bottom: props.offsetbottom, left: props.offsetleft, right: props.offsetright }}>
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
      {
        props.viewtype === 'Stacked' ? <VictoryStack colorScale={this.state.colors}>
          {
            this.getBarChart(props)
          }
        </VictoryStack> : <VictoryGroup colorScale={this.state.colors} offset={5}>
          {
            this.getBarChart(props)
          }
        </VictoryGroup>
      }
    </VictoryChart></View>);
  }
}
