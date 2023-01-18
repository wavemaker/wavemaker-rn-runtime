import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Svg } from 'react-native-svg';

import { VictoryLegend, VictoryPie } from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, WmPieChartStyles } from './pie-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from '@wavemaker/app-rn-runtime/components/chart/basechart.component';
import WmDonutChartProps from '@wavemaker/app-rn-runtime/components/chart/donut-chart/donut-chart.props';

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {
  innerradius: number = 0;
  chartWidth = 0;
}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {
  private _pieChartHeight: number = 0;
  private labelLegendHeight: number = 0;
  private legendHeight: number = 0;
  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, props.type === 'Donut' ? new WmDonutChartProps() : new WmPieChartProps(), new WmPieChartState());
  }

  setInnerRadius() {
    let ratio = this.state.props.donutratio;
    if (typeof ratio === 'string') {
      ratio = parseFloat(ratio);
    }
    const innerRadius: number = ratio * 90;
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

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;
    this.updateState({
      chartWidth: viewWidth
    } as WmPieChartState)
  }

  renderWidget(props: WmPieChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    const pieData = this.state.data[0];
    let radius = (this._pieChartHeight-200)/2;
    let styleProp = {};
    let labelRadius;
    if (props.showlabels === 'hide') {
      styleProp={labels: { display: "none" }};
    } else if (props.showlabels === 'inside') {
      labelRadius = radius/2;
    }
    const orientation = props.showlegend === 'right' ? 'vertical' : 'horizontal';
    let legendData: Array<{name: any}> = pieData.map((d: {x: any, y: any}, index: number) => {return {name: d?.x?.toString(), symbol: { fill: this.state.colors[index] }}});
    return (
      <View style={this.styles.root} onLayout={this.onViewLayoutChange}>
        {this.state.chartWidth ? (
        <Svg
          width={this.state.chartWidth}
          height={this.state.chartHeight}
        >
          <VictoryPie
            style={styleProp}
            standalone={false}
            colorScale={this.state.colors}
            labels={({datum}) => {
              return '';
            }}
            endAngle={this.state.endAngle || 0}
            radius={(Math.min(this.state.chartWidth, this.state.chartHeight) - 20)/ 2}
            innerRadius={props.innerradius || this.state.innerradius}
            theme={this.state.theme}
            key={props.name}
            name={props.name}
            data={pieData}
            origin={{x: (this.state.chartWidth/2), y: (this.state.chartHeight/2)}}
            labelPlacement={props.labelplacement}
          />
        </Svg>) : null}
      </View>
    );
  }
}
