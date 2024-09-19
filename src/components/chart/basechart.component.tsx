import React from "react";
import { Dimensions, View, Text, LayoutChangeEvent, LayoutRectangle} from 'react-native';
import moment from "moment";
import {forEach, get, isArray, isEmpty, isObject, maxBy, minBy, set, trim, orderBy} from "lodash-es";
import { ScatterSymbolType } from "victory-core";
import {VictoryAxis, VictoryLegend, VictoryLabel, VictoryVoronoiContainer, VictoryTooltip} from "victory-native";

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";
import ThemeFactory  from "@wavemaker/app-rn-runtime/components/chart/theme/chart.theme";

import BaseChartComponentProps from "./basechart.props";
import { DEFAULT_CLASS, BaseChartComponentStyles} from "./basechart.styles";
import _ from "lodash";
import { constructSampleData, getChartType } from "./staticdata";
import { isWebPreviewMode } from "@wavemaker/app-rn-runtime/core/utils";

export class BaseChartComponentState <T extends BaseChartComponentProps> extends BaseComponentState<T> {
  data: any = [];
  content: any = null;
  yAxis: Array<string> = [];
  xaxisDatakeyArr: Array<any> = [];
  legendData: any = [];
  theme: any;
  colors: any;
  xLabel: string = '';
  yLabel: string = '';
  total: number = 0;
  endAngle: number = 0;
  loading: boolean = true;
  chartHeight: number = 0;
  chartWidth: number = 0;
  totalHeight: number = 0;
  chartMinY: number | undefined = undefined;
  chartMinX: number | undefined = undefined;
  chartMaxY: number | undefined = undefined;
  chartMaxX: number | undefined = undefined;
  tooltipXPosition = 0;
  tooltipYPosition = 0;
  tooltipXaxis = 0;
  tooltipYaxis = 0;
  tooltipoffsetx: number = 50;
  tooltipoffsety: number = 60;
  isTooltipOpen: boolean = false;
  selectedItem: any = {}
  template: string = "";
}

const screenWidth = Dimensions.get("window").width;

const shapes: {[key: string]: any} = {
  'circle': 'circle',
  'cross': 'cross',
  'diamond': 'diamond',
  'plus': 'plus',
  'minus': 'minus',
  'square': 'square',
  'star': 'star',
  'triangle-down': 'triangleDown',
  'triangle-up': 'triangleUp',
};

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export abstract class BaseChartComponent<T extends BaseChartComponentProps, S extends BaseChartComponentState<T>, L extends BaseChartComponentStyles> extends BaseComponent<T, S, L> {
  protected screenWidth: number = screenWidth;
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultProps, defaultState);
    if (!props.theme) {
      this.applyTheme(props);
    }
    this.subscribe('globaltouch', (event: any) => {
      this.updateState({
        isTooltipOpen: false
      } as any)
    });
  }

  componentDidMount() {
    super.componentDidMount();
  }

  onViewLayoutChange(e: LayoutChangeEvent){
    let viewWidth = e.nativeEvent.layout.width;
    let viewHeight = e.nativeEvent.layout.height;
    if (this?.state && viewWidth !== this.state.chartWidth) {
      this.updateState({
        chartWidth: Number(viewWidth),
        totalHeight: Number(viewHeight)
      } as any)
    }
  }


  abbreviateNumber(number: any) {
    if (typeof number !== 'number') {
      return number;
    }
    const tier = Math.log10(Math.abs(number)) / 3 | 0;

    if (tier == 0) {
      return number;
    }

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

  getLegendView(colorScale?: any) {
    if (this.state.props.showlegend === 'hide') {
      return null;
    }
    const props = this.state.props;
    let top = props.showlegend === 'bottom' ? parseInt(this.styles.root.height as string) : 0;
    if (top) {
      top = top - (50); // remove legendHeight
    }
    const orientation = (props.showlegend === 'right' || props.showlegend === 'left') ? 'vertical' : 'horizontal';
    return <VictoryLegend
      colorScale={colorScale}
      name={'legendData'}
      orientation={orientation}
      gutter={20}
      data={this.state.legendData}
      style={{ border: { stroke: 'none' } }}
      borderPadding={{top: 30, left: 50}}
      y={top}
    />
  }

  getYScaleMinValue(value: number) {
    const _min = Math.floor(value);
    return Math.abs(value) - _min > 0 ? value - .1 : _min - 1;
  };

  setYAxisFormat(yVal: any, ynumberformat: string){
    const matchFixed = ynumberformat.match(/\.([0-9])f/);
    const matchExponential = ynumberformat.match(/\.([0-9])g/);
    if (matchFixed) {
        return yVal.toFixed(parseInt(matchFixed[1], 10));
    } else if (matchExponential) {
        return yVal.toExponential(parseInt(matchExponential[1], 10));
    }
    switch (ynumberformat) {
      case '%':
          return (yVal * 100).toFixed(0) + '%';
      case 'Billion':
          return (yVal / 1e9).toFixed(1) + 'B';
      case 'Million':
          return (yVal / 1e6).toFixed(1) + 'M';
      case 'Thousand':
          return (yVal / 1e3).toFixed(1) + 'K';
      case ',r':
          return yVal.toLocaleString();
    }
  }

  // x axis with vertical lines having grid stroke colors
  getXaxis() {
    const minIndex = 0;
    const maxIndex = this.state.xaxisDatakeyArr.length - 1;
    const props = this.state.props;
    const getTickValueLabel = props.xtickexpr as any;
    let height = this.styles.root.height || 250;
    let yaxislabeldistance = props.yaxislabeldistance ? props.yaxislabeldistance : height as number - 20;
    if (height && typeof height === 'string') {
      height = parseInt(height);
    }
    return <VictoryAxis crossAxis={false} label={(props.xaxislabel || props.xaxisdatakey || "name") + (props.xunits ? `(${props.xunits})` : '')}
                        style={{
                          axisLabel: this.theme.mergeStyle(this.styles.axisLabel, this.styles.yAxisLabel),
                          grid: props.hidegridxaxis ?
                              { stroke: null } :  this.theme.mergeStyle(this.styles.grid, this.styles.xGrid),
                          axis: props.showxaxis === false ?
                              { stroke: 'none' } :  this.theme.mergeStyle(this.styles.axis, this.styles.xAxis),
                          ticks: this.theme.mergeStyle(this.styles.ticks, this.styles.xTicks),
                          tickLabels: this.theme.mergeStyle(this.styles.tickLabels, this.styles.xTickLabels)
                        }}
                        fixLabelOverlap= {props.autoadjustlabels?true:false}
                        axisLabelComponent={<VictoryLabel y={yaxislabeldistance}/>}
                        tickLabelComponent={<VictoryLabel y={props.offsetyaxis ? props.offsetyaxis : height as number - 30} angle={props.labelangle || 0}/>} theme={this.state.theme}
                        tickCount={this.state.xaxisDatakeyArr.length} 
                        invertAxis={this.isRTL}
                        tickFormat= {(d: number, i: number, ticks: any) => {
                          if (getTickValueLabel) {
                              return getTickValueLabel(this.state.xaxisDatakeyArr[d], i, (ticks || []).length);
                          } else if (this.state.xaxisDatakeyArr) {
                            return this.state.xaxisDatakeyArr[d];
                          }
                          return '';
                        }}
                        />;                    
}            


  /* y axis with horizontal lines having grid stroke colors*/
  getYAxis() {
    const props = this.state.props;
    if (props.showyaxis === false) {
      return null;
    }
    const getTickValueLabel = props.ytickexpr as any;
    const ynumberformat = props.ynumberformat;
    let xaxislabeldistance = props.xaxislabeldistance ? props.xaxislabeldistance : 20
    return <VictoryAxis crossAxis={false} label={(props.yaxislabel || props.yaxisdatakey) + (props.yunits ? `(${props.yunits})` : '')}
                        style={{
                          axisLabel: this.theme.mergeStyle(this.styles.axisLabel, this.styles.yAxisLabel),
                          grid: props.hidegridyaxis ? { stroke: null } : this.theme.mergeStyle(this.styles.grid, this.styles.yGrid),
                          axis: props.showxaxis === false ?
                          { stroke: 'none' } :  this.theme.mergeStyle(this.styles.axis, this.styles.yAxis),
                          ticks: this.theme.mergeStyle(this.styles.ticks, this.styles.yTicks),
                          tickLabels: this.theme.mergeStyle(this.styles.tickLabels, this.styles.yTickLabels)
                        }}
                        fixLabelOverlap= {props.autoadjustlabels?true:false}
                        axisLabelComponent={<VictoryLabel x={xaxislabeldistance}/>}
                        tickLabelComponent={<VictoryLabel x={props.offsetxaxis ? props.offsetxaxis : 50}/>} 
                        theme={this.state.theme}
                        tickFormat= {(d: number, i: number, ticks: any) => {
                          if (getTickValueLabel) {
                            return getTickValueLabel(d, i, (ticks || []).length);
                          }
                          if (ynumberformat) {
                            return this.setYAxisFormat(d, ynumberformat);
                          }
                          return this.abbreviateNumber(d);
                        }}
                        orientation={this.isRTL?"right":"left"}
                        dependentAxis />;
  }
  
  setTooltipTemplate(partialName: any) {
    this.updateState({ template: partialName} as any);
  }

  setTooltipPosition(nativeEvent: any){
    let xCoordinate = isWebPreviewMode() ? nativeEvent.offsetX : nativeEvent.locationX;
    let yCoordinate = isWebPreviewMode() ? nativeEvent.offsetY : nativeEvent.locationY;
    this.updateState({
      tooltipXPosition: xCoordinate - this.state.tooltipoffsetx,
      tooltipYPosition:  yCoordinate - this.state.tooltipoffsety,
    } as any)
  }

  setTooltipPartialLayout(event: LayoutChangeEvent){
    let tooltipLayout = event.nativeEvent.layout;
    this.updateState({
      tooltipoffsetx: tooltipLayout.width/2,
      tooltipoffsety: tooltipLayout.height
    } as any)
  }
  
  renderPointer(){
    return (
      <View 
      style={[
        {
          transform: [
            { rotate: '180deg' }
          ],
          bottom: -10,
          left: this.state.tooltipoffsetx - this.styles.tooltipPointer.borderBottomWidth/2
        },
        this.styles.tooltipPointer
      ]}
    />
    )
  }

  getTooltip() {
    const ynumberformat = this.state.props.ynumberformat;
    let yAxisData = ynumberformat ? this.setYAxisFormat(this.state.tooltipYaxis, ynumberformat) : this.state.tooltipYaxis;
    return this.state.isTooltipOpen ? (
      !isEmpty(this.state.template) && this.props.renderitempartial ?
      <View onLayout={this.setTooltipPartialLayout.bind(this)} style={{ position: "absolute", top: this.state.tooltipYPosition as number, left: this.state.tooltipXPosition as number , zIndex: 99}}>
           {this.props.renderitempartial(this.state.selectedItem, this.state.selectedItem.index, this.state.template)}
           {this.renderPointer()}
      </View> : (
      <View style={[
        { position: "absolute", top: this.state.tooltipYPosition as number, left: this.state.tooltipXPosition as number},
        this.styles.tooltipContainer
      ]}>
        <Text style={[{ fontSize: 16, fontWeight: 'bold' },this.styles.tooltipXText]}>{this.state.tooltipXaxis}</Text>
        <Text style={this.styles.tooltipXText}>{yAxisData}</Text>
        {this.renderPointer()}
      </View>)
    ) : null;
  }  

  // X/Y Domain properties are supported only for Column and Area charts
  isAxisDomainSupported(type: string) {
    return type === 'Column'|| type === 'Area';
  }

  // Check whether X/Y Domain was set to Min and is supported for the present chart
  isAxisDomainValid(axis: string) {
    const props = this.state.props;
    if (get(props, axis + 'domain') === 'Min' && (this.isAxisDomainSupported(props.type))) {
      return true;
    }
    return false;
  };

// Check whether min and max values are finite or not
  areMinMaxValuesValid(values: any) {
    if (isFinite(values.min) && isFinite(values.max)) {
      return true;
    }
    return false;
  };

  setDomainValues() {
    let xDomainValues, yDomainValues;
    if (this.state.data.length > 0) {
      if (this.isAxisDomainValid('x') && typeof this.state.data[0].x === 'number') {
        xDomainValues = this.getXMinMaxValues(this.state.data[0]);
      }
      if (this.isAxisDomainValid('y')) {
        yDomainValues = this.getYMinMaxValues(this.state.data);
      }
      if (xDomainValues) {
        this.updateState({
          chartMinX: yDomainValues.min.x,
          chartMaxX: yDomainValues.max.x
        } as S)
      }
      let yMin;
      if (yDomainValues) {
        if (this.areMinMaxValuesValid({max: yDomainValues.max.y, min: yDomainValues.min.y})) {
          yMin = this.getYScaleMinValue(yDomainValues.min.y);
        }
        this.updateState({
          chartMinY: yMin ? yMin : yDomainValues.min.y,
          chartMaxY: yDomainValues.max.y
        } as S);
      }
    }
  }

  // Getting the min and max values among all the x values
  getXMinMaxValues(datum: Array<{x: number, y: any}>) {
    if (!datum) {
      return;
    }
    const xValues: any = {};
    /*
     compute the min x valuex
     eg: When data has objects
        input: [{x:1, y:2}, {x:2, y:3}, {x:3, y:4}]
        min x: 1
     eg: When data has arrays
        input: [[10, 20], [20, 30], [30, 40]];
        min x: 10
    */
    xValues.min = minBy(datum, (dataObject: {x: any, y: any}) => dataObject.x) || {x: undefined};
    /*
     compute the max x value
     eg: When data has objects
        input: [{x:1, y:2}, {x:2, y:3}, {x:3, y:4}]
        max x: 3
     eg: When data has arrays
        input: [[10, 20], [20, 30], [30, 40]];
        max x: 30
     */
    xValues.max = maxBy(datum, (dataObject: {x: any, y: any}) => dataObject.x)|| {x: undefined};
    return xValues;
  }

  // Getting the min and max values among all the y values
  getYMinMaxValues(datum: Array<Array<{x: any, y: number}>>) {
    const yValues: any = {},
      minValues: any = [],
      maxValues: any = [];
    if (!datum) {
      return;
    }

    /*
     Getting the min and max y values among all the series of data
     compute the min y value
     eg: When data has objects
        input: [[{x:1, y:2}, {x:2, y:3}, {x:3, y:4}], [{x:2, y:3}, {x:3, y:4}, {x:4, y:5}]]
        min y values : '2'(among first set) & '3'(among second set)
        max y values : '4'(among first set) & '5'(among second set)

     eg: When data has arrays
        input: [[[10, 20], [20, 30], [30, 40]], [[20, 30], [30, 40], [40, 50]]]
        min y values : '20'(among first set) & '30'(among second set)
        max y values : '40'(among first set) & '50'(among second set)
     */

    forEach(datum, data => {
      if (data && !isEmpty(data)) {
        minValues.push(minBy(data,  (dataObject: {x: any, y: any}) => { return dataObject.y }));
        maxValues.push(maxBy(data,  (dataObject: {x: any, y: any}) => { return dataObject.y }));
      }
    });
    // Gets the least and highest values among all the min and max values of respective series of data
    yValues.min = minBy(minValues, (dataObject: {x: any, y: any}) => dataObject.y) || {y: undefined};
    yValues.max = maxBy(maxValues, (dataObject: {x: any, y: any}) => dataObject.y) || {y: undefined};
    return yValues;
  }

  setHeightWidthOnChart(cb?: () => void) {
    let height = this.styles.root.height || 250;
    let width = this.styles.root.width || screenWidth;
    if (height && typeof height === 'string') {
      height = parseInt(height);
    }
    if (width && typeof width === 'string') {
      width = parseInt(width);
    }
    this.updateState({
      chartHeight: height,
      chartWidth: width
    } as S, cb);
  }

  applyTheme(props: BaseChartComponentProps) {
    let themeName = props.theme ? props.theme : (props.type === 'Pie' ? 'Azure' : 'Terrestrial');
    let colorsToUse = [];
    if (typeof props.customcolors === 'string' && !isEmpty(props.customcolors)) {
      colorsToUse = props.customcolors.split(',').map(trim);
    }
    let themeToUse;
    if (typeof themeName === 'string') {
      if (!colorsToUse.length) {
        colorsToUse = props.customcolors as string[];
      }
      if(props.customcolors===undefined) {
        colorsToUse = ThemeFactory.getColorsObj(themeName);
      }
      themeToUse = ThemeFactory.getTheme(themeName, props.styles, colorsToUse);
    } else if (typeof themeName === 'object') {
      // if theme is passed as an object then use that custom theme.
      themeToUse = props.theme;
    }
    this.updateState({
      colors: colorsToUse,
      theme: themeToUse
    } as S);
  }

  prepareLegendData() {
    const props = this.state.props;
    if (this.state.yAxis) {
      let ldata: any;
      if (props.type === 'Stack') {
        const data = orderBy(this.state.data[0], 'y', 'asc');
        ldata = data.map((d: any) => {
          return {
            name: this.state.xaxisDatakeyArr[d.x]
          }
        });
      } else {
        ldata = this.state.yAxis.map((d: string) => {
          return {
            name: d
          }
        });
      }

      this.updateState({
        legendData: ldata
      } as S);
    }
  }

  prepareEvents(name: string) {
    return this.state.legendData.map((_: any, idx: number) => {
      return {
        childName: ['legend'],
        target: 'data',
        eventKey: String(idx),
        eventHandlers: {
          onClick: () => {
            return [
              {
                childName: [name + '_' + idx],
                target: 'data',
                eventKey: 'all',
                mutation: (props: any) => {
                  return null;
                }
              }
            ];
          },
          onMouseOver: () => {
          },
          onMouseOut: () => {
          }
        }
      };
    });
  }

  // If date string is bound to xaxis then we are pushing the x values as indexes.
  getxAxisVal(dataObj: {[key: string] : any}, xKey: string, index: number, xaxisDatakeyArr: Array<any>) {
    const value: any = get(dataObj, xKey);
    if (moment(value).isValid() || isNaN(value) || typeof value === 'string' || typeof value === 'number') {
      if (typeof value === "string"){
        xaxisDatakeyArr.push(value.replace("\\n","\n"));
      }
      else{
        xaxisDatakeyArr.push(value);
      }
      return index;
    }
    return value;
  }

  prepareDataItems(dataset: any) {
    const props = this.state.props;
    let xaxis = props.xaxisdatakey;
    let yaxis = props.yaxisdatakey;
    let xaxisDatakeyArr: Array<any> = [];
    let datasets: any = [];
    if (dataset.length === 0) {
      dataset = constructSampleData(getChartType(this.props), yaxis?.split(','), this.props.shape);
      xaxis = "x";
      yaxis = "y";
    }
    if (xaxis && yaxis) {
      let yPts = yaxis.split(',');
      yPts.forEach((y: any) => {
        if (xaxis !== y) {
          datasets.push(dataset.map((o: {[key: string] : any}, xindex: number) => {
            const xVal = this.getxAxisVal(o, xaxis, xindex, xaxisDatakeyArr);
            let yVal: string | number = get(o, y);
            if (typeof yVal === 'string') {
              yVal = parseFloat(yVal) || yVal;
            }
            let dataObj = {
              x: xVal,
              y: yVal,
            };
            if (props.bubblesize) {
              set(dataObj, 'size', get(o, props.bubblesize, 5));
            }
            if (props.shape) {
              set(dataObj, 'symbol', shapes[props.shape]);
            }
            return dataObj;
          }));
        }
      });
      // chartTransform
      this.invokeEventCallback('onTransform', [undefined, this.proxy]);
      if (props.type == 'Pie' || props.type === 'Donut') {
        // for animation effect
        setTimeout(() => {
          this.updateState({
            endAngle: 360,
          } as S);
        }, 500);
      }
      this.updateData(datasets, yPts, xaxisDatakeyArr);
    }
  }


  protected renderLoadingIcon() {
    const props = this.state.props;
    return (<WmIcon id={this.getTestId('loadericon')} styles={this.styles.loadingIcon}
    iconclass={props.loadingicon}
    caption={props.loadingdatamsg}></WmIcon>);
  }

  updateData(datasets: any, yPts: any, xaxisDatakeyArr: Array<any>) {
    const props = this.state.props;
    this.updateState({
      data: datasets as any,
      yAxis: yPts,
      xaxisDatakeyArr: xaxisDatakeyArr
    } as S, () => {
      this.prepareLegendData();
      if (!props.labeltype || props.labeltype === 'percent') {
        this.setTotal(this.state.data[0]);
      }
      if (this.isAxisDomainSupported(props.type) && (props.ydomain || props.xdomain)) {
        this.setDomainValues();
      }
      this.updateState({
        loading: false
      } as S);
    });
  }

  setTotal(data: Array<{x: any, y: number}>) {
    let total = 0;
    data.forEach((d: {x: any, y: any}) => {
      total += d.y as number;
    });
    this.updateState({
      total: total
    } as S);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    const props = this.state.props;
    let units = '';
    switch(name) {
      case 'customcolors':
        if (isEmpty($new)) {
          return;
        }
        if (typeof $new === 'string') {
          $new = $new.split(',');
        }
        this.updateState({
          colors: $new
        } as S);
        break;
      case 'theme':
        this.applyTheme(props);
        break;
      case 'dataset':
        if (!isArray($new)) {
          if (isObject($new) && !isEmpty($new)) {
            $new = [$new];
          } else {
            $new = [];
          }
        }
        $new && this.prepareDataItems($new);
        break;
      case 'xaxislabel':
        if (props.xunits) {
          units = ' (' + props.xunits + ')';
        }
        this.updateState({
          xLabel: $new + units
        } as S);
        break;
      case 'yaxislabel':
        if (props.yunits) {
          units = ' (' + props.yunits + ')';
        }
        this.updateState({
          yLabel: $new + units
        } as S);
        break;
    }
  }
}
function getDataType(widgetContext: { yaxisdatakey: string | null | undefined; shape: any; }): any {
  throw new Error("Function not implemented.");
}

