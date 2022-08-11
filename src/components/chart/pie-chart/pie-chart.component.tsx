import React from 'react';
import {View} from "react-native";

import { VictoryContainer, VictoryLegend, VictoryPie } from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPieChartStyles } from './pie-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";
import WmDonutChartProps from "@wavemaker/app-rn-runtime/components/chart/donut-chart/donut-chart.props";

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {
  innerradius: number = 0;
}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {
  private _pieChartHeight: number = 0;
  private labelLegendHeight: number = 0;
  private legendHeight: number = 0;
  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, props.type === 'Donut' ? new WmDonutChartProps() : new WmPieChartProps(), new WmPieChartState());
  }

  setInnerRadius() {
    let ratio = this.state.props.donutratio;
    if (typeof ratio === 'string') {
      ratio = parseFloat(ratio)
    }
    const innerRadius: number = ratio * this._pieChartHeight/2;
    this.updateState({
      innerradius: innerRadius
    } as WmPieChartState);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setHeightWidthOnChart(this.chartInit.bind(this));
  }

  chartInit() {
    this.legendHeight = 30 || this.props.legendheight;
    this.labelLegendHeight = 20 || this.props.labellegendheight;
    this._pieChartHeight = this.state.chartHeight - this.legendHeight - this.labelLegendHeight;
    if (this.state.props.donutratio && !this.state.innerradius) {
      this.setInnerRadius();
    }
  }

  renderWidget(props: WmPieChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    const pieData = this.state.data[0];
    let radius = (this._pieChartHeight-60)/2;
    let styleProp = {};
    let labelRadius;
    if (props.showlabels === 'hide') {
      styleProp={labels: { display: "none" }};
    } else if (props.showlabels === 'inside') {
      labelRadius = radius/2;
    }
    let legendData: Array<{name: any}> = pieData.map((d: {x: any, y: any}) => {return {name: d.x}});
      return <View style={this.styles.root}>
        <VictoryLegend
          name={'legend'}
          colorScale={this.state.colors}
          theme={this.state.theme}
          title={props.title}
          orientation="horizontal"
          gutter={20}
          data={[]}
          height={this.legendHeight}
        />
        <VictoryLegend
          colorScale={this.state.colors}
          name={'legendData'}
          orientation="horizontal"
          gutter={20}
          data={legendData}
          style={{ border: { stroke: 'none' } }}
          theme={this.state.theme}
          borderPadding={{left: 50}}
          height={this.labelLegendHeight} // TODO: here if contents are more then next row will be hidden. Need to fix this.
        />
    <VictoryPie
      style={styleProp}
      height={this._pieChartHeight}
      domainPadding={50}
      padding={100}
      colorScale={this.state.colors}
      labels={({datum}) => {
        const labelType = props.labeltype;
        if (labelType === 'percent') {
          return `${(datum.y*100/this.state.total).toFixed(1)}%`
        } else if (labelType === 'key') {
          return `${datum.x}`;
        } else if (labelType === 'value') {
          return `${datum.y}`;
        } else if (labelType === 'key-value') {
          return `${datum.x} ${datum.y}`;
        }
        return null;
      }}
      labelRadius={labelRadius}
      animate={{
        duration: 500,
        easing: 'exp'
      }}
      endAngle={this.state.endAngle || 0}
      radius={radius}
      innerRadius={this.state.innerradius}
      theme={this.state.theme}
      key={props.name}
      name={props.name}
      data={pieData}
      />
      </View>
  }
}
