import React from 'react';

import { VictoryContainer, VictoryLegend, VictoryPie } from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPieChartStyles } from './pie-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from "@wavemaker/app-rn-runtime/components/chart/basechart.component";

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {
  innerradius: number = 0;
}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {
  private _chartHeight;
  private _chartWidth;
  private _pieChartHeight;
  private labelLegendHeight;
  private legendHeight;
  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPieChartProps(), new WmPieChartState());

    this._chartHeight = this.chartHeight || 250;
    this._chartWidth = this.chartWidth || this.screenWidth;
    this.legendHeight = 30 || props.legendheight;
    this.labelLegendHeight = 20 || props.labellegendheight;
    this._pieChartHeight = this._chartHeight - this.legendHeight - this.labelLegendHeight;
    if (!this.state.innerradius && this.props.donutratio) {
      this.setInnerRadius();
    }
  }

  setInnerRadius() {
    let ratio = this.props.donutratio;
    if (typeof ratio === 'string') {
      ratio = parseFloat(ratio)
    }
    const innerRadius: number = ratio * this._pieChartHeight/2;
    this.updateState({
      innerradius: innerRadius
    } as WmPieChartState);
  }

  renderWidget(props: WmPieChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    const pieData = this.state.data[0];
    let legendData: Array<{name: any}> = pieData.map((d: {x: any, y: any}) => {return {name: d.x}});
      return <VictoryContainer theme={this.state.theme}
                               height={this._chartHeight}
                               width={this._chartWidth}>
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
      height={this._pieChartHeight}
      domainPadding={50}
      padding={100}
      colorScale={this.state.colors}
      labels={({datum}) => {
        const labelType = props.labeltype;
        if (labelType === 'percent') {
          return `${datum.y*100/this.state.total}%`
        } else if (labelType === 'key') {
          return `${datum.x}`;
        } else if (labelType === 'value') {
          return `${datum.y}`;
        } else if (labelType === 'key-value') {
          return `${datum.x} ${datum.y}`;
        }
        return null;
      }}
      animate={{
        duration: 500,
        easing: 'exp'
      }}
      endAngle={this.state.endAngle || 0}
      radius={(this._pieChartHeight-60)/2}
      innerRadius={this.state.innerradius}
      theme={this.state.theme}
      key={props.name}
      name={props.name}
      data={pieData}
      />
      </VictoryContainer>
  }
}