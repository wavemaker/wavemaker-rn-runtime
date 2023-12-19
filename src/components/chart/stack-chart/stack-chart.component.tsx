import React from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Svg } from 'react-native-svg';
import { VictoryStack, VictoryBar, VictoryChart, VictoryPie, VictoryLegend, VictoryAxis } from 'victory-native';
import { Axis, Scale } from 'victory-core';
import { orderBy, cloneDeep } from 'lodash';

import WmStackChartProps from './stack-chart.props';
import { DEFAULT_CLASS, WmStackChartStyles } from './stack-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from '@wavemaker/app-rn-runtime/components/chart/basechart.component';

export class WmStackChartState extends BaseChartComponentState<WmStackChartProps> {
  chartWidth = 0;
}

export default class WmStackChart extends BaseChartComponent<WmStackChartProps, WmStackChartState, WmStackChartStyles> {
  constructor(props: WmStackChartProps) {
    super(props, DEFAULT_CLASS, new WmStackChartProps(), new WmStackChartState());
  }

  componentDidMount() {
    super.componentDidMount();
    this.setHeightWidthOnChart();
  }

  getNegativeValuesArray() {
    let negativeValuesArray = cloneDeep(this.state.data[0]).filter((d: any) => d.y < 0);
    negativeValuesArray = orderBy(negativeValuesArray, 'y', 'desc');
    return negativeValuesArray;
  }

  getPositiveValuesArray() {
    let positiveValuesArray = cloneDeep(this.state.data[0]).filter((d: any) => d.y > 0);
    positiveValuesArray = orderBy(positiveValuesArray, 'y', 'asc');
    return positiveValuesArray;
  }

  getBarChart(props: WmStackChartProps) {
    if ( this.state.data.length > 0 ) {
      const negativeValues = cloneDeep(this.getNegativeValuesArray());
      const data = negativeValues.concat(cloneDeep(this.getPositiveValuesArray()));
      let currentValue = 0;

      return data.map((d: any, i: number) => {
        let d1: any = [];
        d.x = 0;
        d.y = d.y - currentValue;
        d1.push(d);
        currentValue = d.y < 0 && i === negativeValues.length -1 ? 0 : d.y + currentValue;
        return <VictoryBar key={props.name + '_' + i}
                           cornerRadius={{bottomLeft:(1), bottomRight:(1), topLeft:(1), topRight:(1)}}
                           data={d1}/>
      });
    }
  }

  private getColorCodes() {
      const colors = cloneDeep(this.state.colors);
      return colors.reverse();
  }

  getArcChart(props: WmStackChartProps) {
    if ( this.state.data.length > 0 ) {
      let data = cloneDeep(this.state.data[0]);
      const colorScaleArray = this.getColorCodes();
      const maxValue = Math.max(...data.map((o: any) => o.y));
      data = orderBy(data, 'y', 'desc');
      const radius = Math.min(this.state.chartWidth/2, this.state.chartHeight - 50);
      return data.map((d: any, i: number) => {
        let d1: any = [];
        d1.push(d);
        d1.push({x: d.x, y: maxValue - d.y})
        return <VictoryPie key={props.name + '_' + i}
                           radius={radius}
                           colorScale={[colorScaleArray[i], '#fff0']}
                           startAngle={-80}
                           endAngle={80}
                           cornerRadius={100}
                           standalone={false}
                           origin={{x: (this.state.chartWidth/2), y: (this.state.chartHeight - 50)}}
                           innerRadius={radius - this.state.props.thickness}
                           labels={[]}
                           data={d1}/>
      });
    }
  }

  getArcAxis() {
    const ticks = this.getTickValues();
    const radius = Math.min(this.state.chartWidth/2, this.state.chartHeight-50);
    const axisData: any = [];
    ticks.forEach((d: any, i: any) => {
      axisData.push({x:  `${this.state.props.yunits}${d}`, y: 1})
    });
    return <VictoryPie
     style={{
       labels: {
         fontSize: 12, paddingLeft: 50, paddingRight: 80
       }}
     }
      startAngle={-90}
      endAngle={90}
      standalone={false}
      colorScale={['#fff0']}
      origin={{x: (this.state.chartWidth/2 - 5), y: (this.state.chartHeight - 50)}}
      labelRadius={radius - this.state.props.thickness - 20}
      data={axisData}
    />
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;
    this.updateState({
      chartWidth: viewWidth
    } as WmStackChartState);
  }

  getTickValues() {
    let ticks: any = [];
    if (this.state.data[0].length) {
      let data = cloneDeep(this.state.data[0]);
      const maxValue = Math.max(...data.map((o: any) => o.y));
      const minValue = Math.min(...data.map((o: any) => o.y));
      const scale = Scale.getBaseScale({}, 'x');
      scale.domain([minValue > 0 ? 0 : minValue, maxValue]);
      ticks = Axis.getTicks({}, scale);
      ticks[ticks.length -1] = maxValue;
      if ( minValue < 0 ) {
        if (ticks[0] === 0) {
          ticks.unshift(minValue);
        } else {
          ticks[0] = minValue;
        }
      }
    }
    return ticks;
  }

  renderWidget(props: WmStackChartProps) {
    if (!this.state.data.length) {
      return null;
    }
    let mindomain={x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined, y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined};
    const colorScale = this.state.colors.length === 1 ? this.state.colors[0] : this.state.colors;
    return (
      <View
        style={this.styles.root} onLayout={this.onViewLayoutChange}
      >{
        props.viewtype === 'Bar' ?
          <VictoryChart
            theme={this.state.theme}
            minDomain={mindomain}
            height={this.styles.root.height as number}
            width={this.styles.root.width as number || this.screenWidth}
            padding={{
              top: props.offsettop,
              bottom: props.offsetbottom,
              left: props.offsetleft,
              right: props.offsetright
            }}>
            <VictoryLegend
              name={'legend'}
              containerComponent={<Svg />}
              style={{title: {
                fontFamily: "'Helvetica Neue', 'Helvetica', sans-serif",
                fontSize: 18
              }
              }}
              title={[props.title, props.subheading]}
              orientation="horizontal"
              gutter={20}
              data={[]}
              theme={this.state.theme}
            />
            {this.getLegendView(colorScale)}
            <VictoryAxis crossAxis
                         style={{
                           tickLabels: { fill: this.state.props.showyaxis === false ? 'transparent' : '#000000',  fontSize: 12, padding: this.state.props.thickness/2 + 5},
                           axisLabel: { padding: (15 + this.state.props.thickness/2) },
                           grid: {stroke: 'none'}
                         }}
                         theme={this.state.theme}
                         tickValues={this.getTickValues()}
                         tickFormat={(t) => this.state.props.yunits ? `${this.abbreviateNumber(t)}${this.state.props.yunits}` : `${this.abbreviateNumber(t)}`} dependentAxis />
            <VictoryStack
              colorScale={colorScale}
              horizontal={true}
              style={{
                data: { strokeWidth: this.state.props.thickness }
              }}
            >
              {
                this.getBarChart(props)
              }
            </VictoryStack>
          </VictoryChart> :
          <Svg width={this.state.chartWidth} height={this.state.chartHeight}>
            <VictoryLegend
              name={'legend'}
              containerComponent={<Svg />}
              title={[props.title, props.subheading]}
              orientation="horizontal"
              gutter={20}
              data={[]}
              theme={this.state.theme}
            />
            {this.getArcChart(props)}
            {this.getArcAxis()}
          </Svg>
      }
      </View>
    );
  }
}
