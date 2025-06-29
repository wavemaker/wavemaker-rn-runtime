import React from 'react';
import { LayoutChangeEvent, View, Platform } from 'react-native';
import { Svg } from 'react-native-svg';
import { VictoryStack, VictoryBar, VictoryChart, VictoryPie, VictoryLegend, VictoryAxis } from 'victory-native';
import { Axis, Scale } from 'victory-core';
import { orderBy, cloneDeep, findIndex, isString, isNaN} from 'lodash';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import WmStackChartProps from './stack-chart.props';
import { DEFAULT_CLASS, WmStackChartStyles } from './stack-chart.styles';
import {
  BaseChartComponent,
  BaseChartComponentState
} from '@wavemaker/app-rn-runtime/components/chart/basechart.component';
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

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

  getData() {
    const negativeValues = cloneDeep(this.getNegativeValuesArray());
    return negativeValues.concat(cloneDeep(this.getPositiveValuesArray()));
  }

  updateColors() {
   if (this.state.colors.length === 1 ) {
       return this.state.colors[0];
   } else {
       let colorCodes = cloneDeep(this.state.colors);
       if ( this.state.data.length > 0 ) {
         const orderedData = this.getData();
         this.state.data[0].map((d: any, i: number) => {
           let index = findIndex(orderedData, d);
           colorCodes[index] = this.state.colors[i];
         })
         return colorCodes;
       }
    }
  }

  getLegendColors(){
    if (this.state.colors.length === 1 ) {
      return this.state.colors[0];
  } else {
      let colorCodes = cloneDeep(this.state.colors);
      if ( this.state.data.length > 0 ) {
        const orderedData = orderBy(this.state.data[0], 'y', 'asc');;
        this.state.data[0].map((d: any, i: number) => {
          let index = findIndex(orderedData, d);
          colorCodes[index] = this.state.colors[i];
        })
        return colorCodes;
      }
   }
 }

  getBarChart(props: WmStackChartProps) {
    if ( this.state.data.length > 0 ) {
      const negativeValues = cloneDeep(this.getNegativeValuesArray());
      const data = this.getData();
      let currentValue = 0;
      const yValues = data.map((d: any) => d.y);
      const minValue = Math.min(...yValues);
      const maxValue = Math.max(...yValues);

      return data.map((d: any, i: number) => {
        let cornerRadius: any;
        if (d.y === minValue) {
          cornerRadius = d.y > 0 ? { bottom: 10 } : { top: 10 };
        } else if (d.y === maxValue) {
          cornerRadius = d.y > 0 ? { top: 10 } : { bottom: 10 };
        } else {
          cornerRadius = 0;
        }        
        let d1: any = [];
        d.index = d.x;
        d.x = 0;
        d.y = d.y - currentValue;
        d1.push(d);
        currentValue = d.y < 0 && i === negativeValues.length -1 ? 0 : d.y + currentValue;
        return <VictoryBar key={props.name + '_' + i}
                          cornerRadius={cornerRadius}
                          barWidth={this.state.props.thickness}
                          data={d1}
                          events={[
                            {
                              target: 'data',
                              eventHandlers: Platform.OS === 'web'
                                ? { onClick: this.onSelect.bind(this) }
                                : { onPress: this.onSelect.bind(this) }
                            }
                          ]}/>
      });
    }
  }

  private getColorCodes() {
      const colors = cloneDeep(this.updateColors());
      return isString(colors) ? [colors] : colors.reverse();
  }

  getArcChart(props: WmStackChartProps) {
    if ( this.state.data.length > 0 ) {
      let data = this.getData()
      let negativeValues = cloneDeep(this.getNegativeValuesArray());
      let currentValue = 0;
      let prevValue = 0
      data = data.map((d: any, i: number) => {
        d.y = d.y - currentValue
        prevValue = d.y
        d.y = Math.abs(d.y)
        d.index = d.x
        currentValue = prevValue < 0 && i === negativeValues.length -1 ? 0 : prevValue + currentValue;
        return d
      })
      data.reverse()
      if(negativeValues.length > 1){
        const portionToReverse = data.slice(-(negativeValues.length));
        const reversedPortion = portionToReverse.reverse();
        data = [...data.slice(0, -(negativeValues.length)), ...reversedPortion];
      }
      const radius = Math.min(this.state.chartWidth/2, this.state.chartHeight - 50);
      const angles = data.map((d: any, i: number) => {
        let total = data.reduce((sum: number, item: any) => sum + item.y, 0);
        return Math.round((d.y / total) * 160);
      });
      let startAngle = this.isRTL ? -80 : 80
      return data.map((d: any, i: number) => {
        let d1: any = [];
        d1.push(d);
        if (i != 0) {
          startAngle = this.isRTL ? startAngle + angles[i - 1] - (angles[i - 1] / 10) : startAngle - angles[i - 1] + (angles[i - 1] / 10)
        }
        return <VictoryPie key={props.name + '_' + i}
                           radius={radius}
                           colorScale={[this.state.colors[d.index], '#fff0']}
                           startAngle={angles ? startAngle : -80}
                           endAngle={this.isRTL ? 80 : -80}
                           cornerRadius={100}
                           standalone={false}
                           origin={{x: (this.state.chartWidth/2), y: (this.state.chartHeight - 50)}}
                           innerRadius={radius - this.state.props.thickness}
                           labels={[]}
                           events={[{
                            target: 'data',
                            eventHandlers: Platform.OS == "web" ? {
                              onClick: this.onSelect.bind(this)
                            }:{
                              onPress: this.onSelect.bind(this)
                            }
                          }]}
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
      startAngle={this.isRTL ? 90 : -90}
      endAngle={this.isRTL ? -90 : 90}
      standalone={false}
      colorScale={['#fff0']}
      origin={{x: (this.state.chartWidth/2 - 5), y: (this.state.chartHeight - 50)}}
      labelRadius={radius - this.state.props.thickness - 20}
      data={axisData}
    />
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let viewWidth = e.nativeEvent.layout.width;

    this.handleLayout(e)

    this.updateState({
      chartWidth: viewWidth
    } as WmStackChartState);
  }

  getTickValues() {
    let ticks: any = [];
    if (this.state.data[0].length) {
      let data = cloneDeep(this.state.data[0]);
      const maxValue = Math.max(...data.map((o: any) => o.y ? o.y : 0));
      const minValue = Math.min(...data.map((o: any) => o.y ? o.y : 0));
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
      } else {
        ticks[0] = this.state.props.minvalue;
      }
    }
    return ticks;
  }

  onSelect(event: any, data: any){
    if (!this.viewRef.current) return;
    if (!this.state.props.dataset) return;
    this.viewRef.current.measureInWindow((chartX: number, chartY: number) => {
    let props = this.state.props
    let index = data.datum.index
    let yaxisKey = props.yaxisdatakey;
    let label = this.state.xaxisDatakeyArr[index];
    let value = props.dataset[index][yaxisKey];
    let selectedItem = props.dataset[index];
    let selectedChartItem = [{series: 0, x: index, y: value,_dataObj: selectedItem}, index];
    const nativeEvent = event.nativeEvent;
    let tooltipX = nativeEvent.pageX - chartX;
    let tooltipY = nativeEvent.pageY - chartY;
    this.updateState({
      tooltipXaxis: label,
      tooltipYaxis: value,
      isTooltipOpen: true,
      selectedItem: {...selectedItem, index: index},
      tooltipXPosition: tooltipX - this.state.tooltipoffsetx, 
      tooltipYPosition: tooltipY - this.state.tooltipoffsety
    } as WmStackChartState)
    this.invokeEventCallback('onSelect', [event.nativeEvent, this.proxy, selectedItem, selectedChartItem ]);
  });
  }

  renderWidget(props: WmStackChartProps) {
    this.invokeEventCallback('onBeforerender', [this.proxy, null]);
    if (!this.state.data.length) {
      return null;
    }
    let mindomain={x: this.props.xdomain === 'Min' ? this.state.chartMinX: undefined, y: this.props.ydomain === 'Min' ? this.state.chartMinY: undefined};
    const data = this.getData();
    const yValues = data.map((d: any) => d.y);
    const minValue = Math.min(...yValues);
    const maxValue = Math.max(...yValues);
    return (
      <View
        {...getAccessibilityProps(AccessibilityWidgetType.LINECHART, props)}
        style={this.styles.root} onLayout={this.onViewLayoutChange}
      >
        {this.getTooltip()}{
        props.viewtype === 'Bar' ?
        <View ref={this.viewRef}>
          <VictoryChart
            theme={this.state.theme}
            minDomain={mindomain}
            domain={(this.isRTL && !isNaN(maxValue) && !isNaN(minValue)) ? [maxValue, minValue > 0 ? 0 : minValue] : undefined}
            domainPadding={{ x: 10 }}
            height={this.styles.root.height as number}
            width={this.styles.root.width as number || this.state.chartWidth || 200}
            padding={{ top: props.offsettop, bottom: props.offsetbottom, left: this.isRTL ? props.offsetright : props.offsetleft, right: this.isRTL ? props.offsetleft : props.offsetright }}
            >
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
            {this.getLegendView(this.getLegendColors())}
            <VictoryAxis crossAxis
                         style={{
                           tickLabels: { fill: this.state.props.showyaxis === false ? 'transparent' : '#000000',  fontSize: 12, padding: this.state.props.thickness/2 + 5},
                           axisLabel: { padding: (15 + this.state.props.thickness/2) },
                           grid: {stroke: 'none'},
                           axis: {stroke: 'none'},
                           ticks: {stroke: 'none'}
                         }}
                         theme={this.state.theme}
                         tickValues={this.getTickValues()}
                         tickFormat={(t: any) => this.state.props.yunits ? `${this.abbreviateNumber(t)}${this.state.props.yunits}` : `${this.abbreviateNumber(t)}`} dependentAxis />
            <VictoryStack
              colorScale={this.updateColors()}
              horizontal={true}
            >
              {
                this.getBarChart(props)
              }
            </VictoryStack>
          </VictoryChart>
          </View>:
          <View ref={this.viewRef}>
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
          </View>
      }
      </View>
    );
  }
}
