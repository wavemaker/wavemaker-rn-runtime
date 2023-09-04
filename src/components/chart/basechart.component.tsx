import React from "react";
import { Dimensions } from 'react-native';
import moment from "moment";
import {forEach, get, isArray, isEmpty, isObject, maxBy, minBy, set, trim, orderBy} from "lodash-es";
import { ScatterSymbolType } from "victory-core";
import {VictoryAxis, VictoryLegend, VictoryLabel} from "victory-native";

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";
import ThemeFactory  from "@wavemaker/app-rn-runtime/components/chart/theme/chart.theme";

import BaseChartComponentProps from "./basechart.props";
import { DEFAULT_CLASS, BaseChartComponentStyles} from "./basechart.styles";
import _ from "lodash";


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
  chartMinY: number | undefined = undefined;
  chartMinX: number | undefined = undefined;
  chartMaxY: number | undefined = undefined;
  chartMaxX: number | undefined = undefined;
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

const dataTypeJSON = ['Column', 'Line', 'Pie', 'Bar', 'Donut', 'Bubble']

const SAMPLE_DATA1 = {
  'group1' : 'Europe',
  'group2' : 'Asia',
  'group3' : 'America',
  'group4' : 'Australia'
}

const SAMPLE_DATA = {
    'group1' : '01/01/2001',
    'group2' : '01/01/2002',
    'group3' : '01/01/2003',
};
const SAMPLE_DATA2 = {
  'group1' : '78.6',
  'group2' : '79',
  'group3' : '80',
  'group4' : '80.66'
};
export const chartTypes = ['Column', 'Line', 'Area', 'Cumulative Line', 'Bar', 'Pie', 'Donut', 'Bubble']

export const isPieChart = (type: string) => type === 'Pie';

// returns true if chart type is line
export const isLineChart = (type: string) => type === 'Line';

// returns true if chart type is bar
export const isBarChart = (type: string) => type === 'Bar';

// returns true if chart type is donut
export const isDonutChart = (type: string) => type === 'Donut';

// returns true if chart type is bubble
export const isBubbleChart = (type: string) => type === 'Bubble';

export const isAreaChart = (type: string) => type === 'Area';

// returns true if chart type is column
export const isColumnChart = (type: string) => type === 'Column';

export const isPieType = (type: string) => isPieChart(type) || isDonutChart(type);

// The format of chart data is array of json objects in case of the following types of chart
export const isChartDataJSON = (type: any) => _.includes(dataTypeJSON, type) || !_.includes(chartTypes, type);


export const constructSampleData = (dataType: any, yaxisLength: any, shape: string) => {
  let first_series = [],
      second_series = [],
      third_series = [],
      first_series_array = [],
      second_series_array = [],
      third_series_array = [],
      first_series_bubble = [],
      second_series_bubble = [],
      third_series_bubble = [],
      
      data: { values?:  { x: string | number; y?: string | number; size?: number; shape?: any; }[]  | number[][]; key: any; }[] | { x: any; y?: number;  }[] = [];
  switch (dataType) {
    case 'jsonFormat':
      first_series = [
          {'x': '01/01/2001', 'y': 4000000},
          {'x': '01/01/2002', 'y': 1000000},
          {'x': '01/01/2003', 'y': 5000000}
      ];
      second_series = [
          {'x': '01/01/2001', 'y': 3000000},
          {'x': '01/01/2002', 'y': 4000000},
          {'x': '01/01/2003', 'y': 7000000}
      ];
      third_series = [
          {'x': '01/01/2001', 'y': 2000000},
          {'x': '01/01/2002', 'y': 8000000},
          {'x': '01/01/2003', 'y': 6000000}
      ];
      data[0] = {
          values: first_series,
          key: SAMPLE_DATA.group1
      };
      if (yaxisLength >= 2) {
          data[1] = {
              values: second_series,
              key: SAMPLE_DATA.group2
          };
      }
      if (yaxisLength >= 3) {
          data[2] = {
              values: third_series,
              key: SAMPLE_DATA.group3
          };
      }
      break;
    case 'arrayFormat':
      first_series_array = [
          [1, 4000000],
          [2, 1000000],
          [3, 5000000]
      ];
      second_series_array = [
          [1, 3000000],
          [2, 4000000],
          [3, 7000000]
      ];
      third_series_array = [
          [1, 2000000],
          [2, 8000000],
          [3, 6000000]
      ];
      data[0] = {
          values: first_series_array,
          key: SAMPLE_DATA.group1
      };
      if (yaxisLength >= 2) {
          data[1] = {
              values: second_series_array,
              key: SAMPLE_DATA.group2
          };
      }
      if (yaxisLength >= 3) {
          data[2] = {
              values: third_series_array,
              key: SAMPLE_DATA.group3
          };
      }
            break;
            case 'columnChartFormat':
              data = [
                {'x': SAMPLE_DATA.group1, 'y': 3}
            ];
            break;
            case 'barChartFormat':
              data = [
                {'x': SAMPLE_DATA.group1, 'y': 2000000},
                {'x': SAMPLE_DATA.group2, 'y': 1000000},
                {'x': SAMPLE_DATA.group3, 'y': 3000000}
            ];
            break;
            case 'lineChartFormat':
              data = [
                {'x': SAMPLE_DATA1.group1, 'y': 2},
                {'x': SAMPLE_DATA1.group2, 'y': 0},
                {'x': SAMPLE_DATA1.group3, 'y': 3}
            ];
              break;
              case 'bubbleFormat':
                // shape = shape === 'random' ?  shapes[Math.floor(Math.random() * shapes.length)] : shape;
                data = [
                  {'x': SAMPLE_DATA2.group1, 'y': 1000000},
                  {'x': SAMPLE_DATA2.group2, 'y': 2000000},
                  {'x': SAMPLE_DATA2.group3, 'y': 3000000},
                  {'x': SAMPLE_DATA2.group4, 'y': 4000000}
              ];
              break;
                case 'pieChartFormat':
                  data = [
                      {'x': SAMPLE_DATA1.group1, 'y': 1000000},
                      {'x': SAMPLE_DATA1.group2, 'y': 2000000},
                      {'x': SAMPLE_DATA1.group3, 'y': 3000000},
                      {'x': SAMPLE_DATA1.group4, 'y': 4000000}
                  ];
                  break;
    
  }
  return data;

};

export const getChartType = (widgetContext: { type: any; }) => {
  const type = widgetContext.type;
  if (isLineChart(type)) {
      return 'lineChartFormat';
  }
  if (isAreaChart(type)) {
    return 'lineChartFormat'; 
  }
  if (isBarChart(type)) {
    return 'barChartFormat'; 
  }
  if (isColumnChart(type)) {
    return 'columnChartFormat'; 
  }
  if (isPieChart(type)) {
      return 'pieChartFormat';
  }
  if (isBubbleChart(type)) {
      return 'bubbleFormat';
  }
  if (isDonutChart(type)) {
    return 'pieChartFormat';
}
  return isChartDataJSON(type) ? 'jsonFormat' : 'arrayFormat';
};

// Sample data to populate when no data is bound
export const getSampleData = (widgetContext: { yaxisdatakey: any; shape: any; }) => constructSampleData(getDataType(widgetContext), _.split(widgetContext.yaxisdatakey, ',').length, widgetContext.shape);

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export abstract class BaseChartComponent<T extends BaseChartComponentProps, S extends BaseChartComponentState<T>, L extends BaseChartComponentStyles> extends BaseComponent<T, S, L> {
  protected screenWidth: number = screenWidth;
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultProps, defaultState);
    if (!props.theme) {
      this.applyTheme(props);
    }
  }

  componentDidMount() {
    super.componentDidMount();
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
    let top = this.props.showlegend === 'bottom' ? parseInt(this.styles.root.height as string) : 0;
    if (top) {
      top = top - (50); // remove legendHeight
    }
    const orientation = (this.props.showlegend === 'right' || this.props.showlegend === 'left') ? 'vertical' : 'horizontal';
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

  // x axis with vertical lines having grid stroke colors
  getXaxis() {
    // if (this.state.props.showxaxis === false) {
    //   return null;
    // }
    return <VictoryAxis crossAxis label={(this.props.xaxislabel || this.props.xaxisdatakey || "name") + (this.props.xunits ? `(${this.props.xunits})` : '')}
                        style={{
                          grid: this.styles.grid,
                          axis: {stroke: this.props.showxaxis === false? 'none': '#000000'}
                        }}
                        fixLabelOverlap={true}
                        tickLabelComponent={<VictoryLabel angle={this.props.labelangle || 0} />} theme={this.state.theme}
                        tickCount={this.state.xaxisDatakeyArr.length}  
                        tickFormat={(d) => `${this.state.xaxisDatakeyArr[d] ? this.state.xaxisDatakeyArr[d]: ''}`}/>;                    
  }
  /* y axis with horizontal lines having grid stroke colors*/
  getYAxis() {
    // if (this.props.showyaxis === false) {
    //   return null;
    // }
    return <VictoryAxis crossAxis label={(this.props.yaxislabel || this.props.yaxisdatakey || "datavalue") + (this.props.yunits ? `(${this.props.yunits})` : '')}
                        style={{
                          axisLabel: {padding: this.props.yaxislabeldistance},
                          grid: this.styles.grid,
                          axis: {stroke: this.props.showyaxis === false? 'none': '#000000'}
                        }}
                        theme={this.state.theme}
                        tickFormat={(t) => `${this.abbreviateNumber(t)}`} dependentAxis />;
  }

  // X/Y Domain properties are supported only for Column and Area charts
  isAxisDomainSupported(type: string) {
    return type === 'Column'|| type === 'Area';
  }

  // Check whether X/Y Domain was set to Min and is supported for the present chart
  isAxisDomainValid(axis: string) {
    if (get(this.props, axis + 'domain') === 'Min' && (this.isAxisDomainSupported(this.props.type))) {
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
     compute the min x value
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
        colorsToUse = ThemeFactory.getColorsObj(themeName);
      }
      themeToUse = ThemeFactory.getTheme(themeName, this.props.styles, colorsToUse);
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
    if (this.state.yAxis) {
      let ldata: any;
      if (this.props.type === 'Stack') {
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
      xaxisDatakeyArr.push(value);
      return index;
    }
    return value;
  }

  prepareDataItems(dataset: any) {
    let xaxis = this.props.xaxisdatakey;
    let yaxis = this.props.yaxisdatakey;
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
            if (this.props.bubblesize) {
              set(dataObj, 'size', get(o, this.props.bubblesize, 5));
            }
            if (this.props.shape) {
              set(dataObj, 'symbol', shapes[this.props.shape]);
            }
            return dataObj;
          }));
        }
      });
      // chartTransform
      this.invokeEventCallback('onTransform', [undefined, this.proxy]);
      if (this.props.type == 'Pie' || this.props.type === 'Donut') {
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
    return (<WmIcon styles={this.styles.loadingIcon}
    iconclass={this.props.loadingicon}
    caption={this.props.loadingdatamsg}></WmIcon>);
  }

  updateData(datasets: any, yPts: any, xaxisDatakeyArr: Array<any>) {
    this.updateState({
      data: datasets as any,
      yAxis: yPts,
      xaxisDatakeyArr: xaxisDatakeyArr
    } as S, () => {
      this.prepareLegendData();
      if (!this.props.labeltype || this.props.labeltype === 'percent') {
        this.setTotal(this.state.data[0]);
      }
      if (this.isAxisDomainSupported(this.props.type) && (this.props.ydomain || this.props.xdomain)) {
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
        this.applyTheme(this.props);
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
        if (this.props.xunits) {
          units = ' (' + this.props.xunits + ')';
        }
        this.updateState({
          xLabel: $new + units
        } as S);
        break;
      case 'yaxislabel':
        if (this.props.yunits) {
          units = ' (' + this.props.yunits + ')';
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

