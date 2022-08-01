import { assign } from "lodash";
import { VictoryThemeDefinition } from "victory-core";
import ThemeVariables from "@wavemaker/app-rn-runtime/styles/theme.variables";

const themes: {[key:string]: any} = {
  'Terrestrial': {
    colors: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5', '#ccc'],
    tooltip: {
      'backgroundColor': '#de7d28',
      'textColor': '#FFFFFF'
    }
  },
  'Annabelle': {
    colors: ['#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939', '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39', '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b', '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6', '#ccc'],
    tooltip: {
      'backgroundColor': '#2e306f',
      'textColor': '#FFFFFF'
    }
  },
  'Azure': {
    colors: ['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#e6550d', '#fd8d3c', '#fdae6b', '#fdd0a2', '#31a354', '#74c476', '#a1d99b', '#c7e9c0', '#756bb1', '#9e9ac8', '#bcbddc', '#dadaeb', '#636363', '#969696', '#bdbdbd', '#d9d9d9', '#ccc'],
    tooltip: {
      'backgroundColor': '#3182bd',
      'textColor': '#FFFFFF'
    }
  },
  'Retro': {
    colors: ['#0ca7a1', '#ffa615', '#334957', '#acc5c2', '#988f90', '#8accc9', '#515151', '#f27861', '#36c9fd', '#794668', '#0f709d', '#0d2738', '#44be78', '#4a1839', '#6a393f', '#557d8b', '#6c331c', '#1c1c1c', '#861500', '#09562a', '#ccc'],
    tooltip: {
      'backgroundColor': '#80513a',
      'textColor': '#FFFFFF'
    }
  },
  'Mellow': {
    colors: ['#f0dcbf', '#88c877', '#aeb918', '#2e2c23', '#ddddd2', '#dfe956', '#4c963b', '#5d3801', '#e1eec3', '#cd8472', '#fcfab3', '#9a4635', '#9295ad', '#2e3f12', '#565677', '#557d8b', '#4f4d02', '#0c0c1b', '#833324', '#24120e', '#ccc'],
    tooltip: {
      'backgroundColor': '#7c9e73',
      'textColor': '#FFFFFF'
    }
  },
  'Orient': {
    colors: ['#a80000', '#cc6c3c', '#f0e400', '#000084', '#fccc6c', '#009c6c', '#cc309c', '#78cc00', '#fc84e4', '#48e4fc', '#4878d8', '#186c0c', '#606060', '#a8a8a8', '#000000', '#d7d7d7', '#75a06e', '#190d0b', '#888888', '#694b84', '#ccc'],
    tooltip: {
      'backgroundColor': '#c14242',
      'textColor': '#FFFFFF'
    }
  },
  'GrayScale': {
    colors: ['#141414', '#353535', '#5b5b5b', '#848484', '#a8a8a8', '#c3c3c3', '#e0e0e0', '#c8c8c8', '#a5a5a5', '#878787', '#656565', '#4e4e4e', '#303030', '#1c1c1c', '#4f4f4f', '#3b3b3b', '#757575', '#606060', '#868686', '#c1c1c1', '#ccc'],
    tooltip: {
      'backgroundColor': '#575757',
      'textColor': '#FFFFFF'
    }
  },
  'Flyer': {
    colors: ['#3f454c', '#5a646e', '#848778', '#cededf', '#74c4dd', '#0946ed', '#380bb1', '#000ff0', '#f54a23', '#1db262', '#bca3aa', '#ffa500', '#a86b32', '#63a18c', '#56795e', '#934343', '#b75f5f', '#752d2d', '#4e1111', '#920606', '#ccc'],
    tooltip: {
      'backgroundColor': '#47637c',
      'textColor': '#FFFFFF'
    }
  },
  'Luminosity': {
    colors: ['#FFFFFF', '#e4e4e4', '#00bcd4', '#f0dd2f', '#00aabf', '#018376', '#e91e63', '#39e5d4', '#ff6d6d', '#00ff76', '#ff9800', '#969696', '#ff4200', '#e00000', '#95cbe5', '#5331ff', '#fff4a7', '#e7a800', '#0061e4', '#d5e7ff', '#ccc'],
    tooltip: {
      'backgroundColor': '#47637c',
      'textColor': '#FFFFFF'
    }
  }
}

class ThemeFactory {
  getColorsObj(themeName: string) {
    return themes[themeName].colors;
  }

  getTheme(name: string, styles?: any, customColors?: Array<string>) {
    const colorsToUse = this.getColorsObj(name);
    const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10] = colorsToUse;
    let colors = [
      c1,
      c2,
      c3,
      c4,
      c5,
      c6,
    ];
    if (customColors && customColors.length) {
      colors = customColors;
    }
    const gridColor = colorsToUse[colorsToUse.length - 1];
    let textColorFromProps;
    if (styles) {
      textColorFromProps = styles.text.color;
    }

    // Typography
    const sansSerif = "'Helvetica Neue', 'Helvetica', sans-serif";
    const letterSpacing = "normal";
    const fontSize = 12;

    // Layout
    const padding = 8;
    const baseProps = {
      width: 350,
      height: 350,
      padding: 50,
    };

    // Labels
    const baseLabelStyles = {
      fontFamily: sansSerif,
      fontSize,
      letterSpacing,
      padding,
      fill: textColorFromProps || ThemeVariables.defaultTextColor,
      stroke: "transparent",
      strokeWidth: 0,
    };

    const centeredLabelStyles = assign({ textAnchor: "middle" }, baseLabelStyles);

    // Strokes
    const strokeDasharray = "10, 5";
    const strokeLinecap = "round";
    const strokeLinejoin = "round";

    const baseChartTheme: VictoryThemeDefinition = {
      area: assign(
        {
          style: {
            data: {
              fill: c10,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      axis: assign(
        {
          style: {
            axis: {
              fill: "transparent",
              stroke: textColorFromProps || ThemeVariables.chartAxisColor,
              strokeWidth: 2,
              strokeLinecap,
              strokeLinejoin,
            },
            axisLabel: assign({}, centeredLabelStyles, {
              padding: 30,
              stroke: "transparent",
              fontSize: 15
            }),
            grid: {
              fill: "none",
              stroke: gridColor,
              strokeDasharray,
              strokeLinecap,
              strokeLinejoin,
              pointerEvents: "painted",
            },
            ticks: {
              fill: "transparent",
              size: 5,
              stroke: ThemeVariables.chartAxisPointColor,
              strokeWidth: 1,
              strokeLinecap,
              strokeLinejoin,
            },
            tickLabels: assign({}, baseLabelStyles, {
              fill: textColorFromProps || ThemeVariables.defaultTextColor,
            }),
          },
        },
        baseProps,
      ),
      polarDependentAxis: assign({
        style: {
          ticks: {
            fill: "transparent",
            size: 1,
            stroke: "transparent",
          },
        },
      }),
      bar: assign(
        {
          style: {
            data: {
              fill: c1,
              padding,
              strokeWidth: 0,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      boxplot: assign(
        {
          style: {
            max: { padding, stroke: c9, strokeWidth: 1 },
            maxLabels: assign({}, baseLabelStyles, { padding: 3 }),
            median: { padding, stroke: c9, strokeWidth: 1 },
            medianLabels: assign({}, baseLabelStyles, { padding: 3 }),
            min: { padding, stroke: c9, strokeWidth: 1 },
            minLabels: assign({}, baseLabelStyles, { padding: 3 }),
            q1: { padding, fill: c9 },
            q1Labels: assign({}, baseLabelStyles, { padding: 3 }),
            q3: { padding, fill: c9 },
            q3Labels: assign({}, baseLabelStyles, { padding: 3 }),
          },
          boxWidth: 20,
        },
        baseProps,
      ),
      candlestick: assign(
        {
          style: {
            data: {
              stroke: c9,
            },
            labels: assign({}, baseLabelStyles, { padding: 5 }),
          },
          candleColors: {
            positive: "#ffffff",
            negative: c9,
          },
        },
        baseProps,
      ),
      chart: baseProps,
      errorbar: assign(
        {
          borderWidth: 8,
          style: {
            data: {
              fill: "transparent",
              opacity: 1,
              stroke: c9,
              strokeWidth: 2,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      group: assign(
        {
          colorScale: colors,
        },
        baseProps,
      ),
      histogram: assign(
        {
          style: {
            data: {
              fill: c9,
              stroke: c10,
              strokeWidth: 2,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      legend: {
        colorScale: colors,
        gutter: 10,
        orientation: "vertical",
        titleOrientation: "top",
        style: {
          data: {
            type: "circle",
          },
          border: { stroke: ThemeVariables.chartLegendBorder },
          labels: baseLabelStyles,
          title: assign({}, baseLabelStyles, { padding: 5 }),
        },
      },
      line: assign(
        {
          style: {
            data: {
              fill: "transparent",
              opacity: 1,
              stroke: c1,
              strokeWidth: 2,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      pie: assign(
        {
          colorScale: colors,
          style: {
            data: {
              padding,
              stroke: '#ffffff',
              strokeWidth: 1,
            },
            labels: assign({}, baseLabelStyles, { padding: 20 }),
          },
        },
        baseProps,
      ),
      scatter: assign(
        {
          style: {
            data: {
              fill: c9,
              opacity: 1,
              stroke: "transparent",
              strokeWidth: 0,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps,
      ),
      stack: assign(
        {
          colorScale: colors,
        },
        baseProps,
      ),
      tooltip: {
        style: assign({}, baseLabelStyles, { padding: 0, pointerEvents: "none" }),
        flyoutStyle: {
          stroke: c10,
          strokeWidth: 1,
          fill: "#f0f0f0",
          pointerEvents: "none",
        },
        flyoutPadding: 5,
        cornerRadius: 5,
        pointerLength: 10,
      },
      voronoi: assign(
        {
          style: {
            data: {
              fill: "transparent",
              stroke: "transparent",
              strokeWidth: 0,
            },
            labels: assign({}, baseLabelStyles, {
              padding: 5,
              pointerEvents: "none",
            }),
            flyout: {
              stroke: c10,
              strokeWidth: 1,
              fill: "#f0f0f0",
              pointerEvents: "none",
            },
          },
        },
        baseProps,
      ),
    };
    return baseChartTheme;
  }
}

export default new ThemeFactory();
