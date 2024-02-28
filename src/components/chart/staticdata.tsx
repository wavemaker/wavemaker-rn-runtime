import _ from "lodash";

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

function getDataType(widgetContext: { yaxisdatakey: any; shape: any; }): any {
  throw new Error("Function not implemented.");
}
