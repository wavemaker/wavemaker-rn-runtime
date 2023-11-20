import React from 'react';
import { LayoutChangeEvent, View, Text, Platform } from 'react-native';
import { Svg } from 'react-native-svg';

import { VictoryLabel, VictoryLegend, VictoryPie } from 'victory-native';

import WmPieChartProps from './pie-chart.props';
import { DEFAULT_CLASS, WmPieChartStyles } from './pie-chart.styles';

import { formatCompactNumber } from '@wavemaker/app-rn-runtime/core/utils';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import {
  BaseChartComponent,
  BaseChartComponentState
} from '@wavemaker/app-rn-runtime/components/chart/basechart.component';
import WmDonutChartProps from '@wavemaker/app-rn-runtime/components/chart/donut-chart/donut-chart.props';
import { Legend } from '../legend/legend.component';

export class WmPieChartState extends BaseChartComponentState<WmPieChartProps> {
  chartWidth = 0;
  totalHeight = 0;
  infoHeight = 10;
  legendWidth = 0;
  legendHeight = 0;
  opacity = 0;
}

export default class WmPieChart extends BaseChartComponent<WmPieChartProps, WmPieChartState, WmPieChartStyles> {

  constructor(props: WmPieChartProps) {
    super(props, DEFAULT_CLASS, props.type === 'Donut' ? new WmDonutChartProps() : new WmPieChartProps(), new WmPieChartState());
  }

  componentDidMount() {
    super.componentDidMount();
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;
    this.updateState({
      chartWidth: viewWidth,
      totalHeight: e.nativeEvent?.layout.height
    } as WmPieChartState)
  }

  onInfoViewLayoutChange = (e: LayoutChangeEvent) => {
    this.updateState({
      infoHeight: e.nativeEvent?.layout.height,
      opacity: 1
    } as WmPieChartState);
  }

  onLegendViewLayoutChange = (e: LayoutChangeEvent) => {
    this.updateState({
      legendWidth: e.nativeEvent?.layout.width,
      legendHeight: e.nativeEvent?.layout.height
    } as WmPieChartState);
  }

  getLabel(d: {x: any, y: any}, props: WmPieChartProps): string {
      switch(props.labeltype) {
        case 'percent': {
          return Math.round(d.y * 100 /this.state.total) + '%';
        }
        case 'key': {
          return this.state.xaxisDatakeyArr[d.x];
        }
        case 'value': {
          return formatCompactNumber(d.y);
        }
        case 'key-value': {
          return this.state.xaxisDatakeyArr[d.x] + ' ' + d.y;
        }
      }
  }

  onSelect(event: any, data: any){
    let value = data.slice.value;
    let label = this.state.xaxisDatakeyArr[data.datum.x];
    let selectedItem = this.props.dataset[data.index];
    let selectedChartItem = data.slice;
    selectedChartItem["data"] = {x: label, y: value, color: data.style.fill, _dataObj: selectedItem}
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  }

  renderWidget(props: WmPieChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    const pieData = this.state.data[0];
    const chartWidth = this.state.chartWidth 
      - (props.showlegend === 'right' ? this.state.legendWidth : 0);
    const chartHeight = (this.styles.root.height ? this.state.totalHeight : chartWidth) 
      - this.state.infoHeight 
      - (props.showlegend === 'right' ? 0 : this.state.legendHeight);
    let radius = (Math.min(chartWidth, chartHeight) - 40)/ 2;
    let innerRadius = props.donutratio * radius;
    let styleProp = {};
    let labelRadius;
    if (props.showlabels === 'hide') {
      styleProp={labels: { display: "none" }};
    } else if (props.showlabels === 'inside') {
      labelRadius = radius/2;
    } else {
      labelRadius = radius + 8;
    }
    const origin = {x: (chartWidth/2), y: (chartHeight/2)};
    const orientation = props.showlegend === 'right' ? 'vertical' : 'horizontal';
    let legendData = pieData.map((d: {x: any, y: any}, index: number) => {
      return {
        name: this.state.xaxisDatakeyArr[d.x],
        color: this.state.colors[index % (this.state.colors.length)]
      };
    });
    return (
      <View style={[{opacity: this.state.opacity}, this.styles.root]}
        onLayout={this.onViewLayoutChange}>
        <View onLayout={this.onInfoViewLayoutChange}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {props.iconclass ? (<WmIcon iconclass={props.iconclass} styles={this.styles.icon}></WmIcon>) : null }
            <Text style={this.styles.title}>{props.title}</Text>
          </View>
          <Text style={this.styles.subHeading}>{props.subheading}</Text>
        </View>
        {props.showlegend === 'top' ? 
          (<View onLayout={this.onLegendViewLayoutChange}>
            <Legend data={legendData}
              testStyle={this.styles.legendText}
              dotStyle={this.styles.legenedDot}></Legend>
          </View>) : null }
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            {chartWidth ? (
            <Svg
              width={chartWidth}
              height={chartHeight}
            >
              <VictoryPie
                style={styleProp}
                standalone={false}
                colorScale={this.state.colors}
                labels={({datum}) => this.getLabel(datum, props)}
                endAngle={this.state.endAngle || 0}
                radius={radius}
                innerRadius={innerRadius}
                theme={this.state.theme}
                key={props.name}
                name={props.name}
                data={pieData}
                origin={origin}
                labelPlacement={props.labelplacement}
                labelRadius={labelRadius}
                events={[{
                  target: 'data',
                  eventHandlers: Platform.OS == "web" ? {
                    onClick: this.onSelect.bind(this)
                  }:{
                    onPress: this.onSelect.bind(this)
                  }
                }]}
              />
              <VictoryLabel
                textAnchor="middle"
                style={this.styles.title as any}
                x={origin.x} y={origin.y}
                text={props.centerlabel}
              />
            </Svg>) : null}
          </View>
          {props.showlegend === 'right' ? 
            (<View style={{maxWidth: '50%'}} onLayout={this.onLegendViewLayoutChange}>
              <Legend data={legendData}
                testStyle={this.styles.legendText}
                dotStyle={this.styles.legenedDot}
                orientation='vertical'></Legend>
            </View>) : null }
        </View>
        {props.showlegend === 'bottom' ? 
          (<View onLayout={this.onLegendViewLayoutChange}>
            <Legend data={legendData}
              testStyle={this.styles.legendText}
              dotStyle={this.styles.legenedDot}></Legend>
          </View>) : null }
      </View>
    );
  }
}
