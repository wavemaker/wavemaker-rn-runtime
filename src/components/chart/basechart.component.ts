import { Dimensions } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import BaseChartComponentProps from "./basechart.props";
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseChartComponentStyles} from "./basechart.styles";
import { BaseChartTheme } from "@wavemaker/app-rn-runtime/components/chart/theme/basechart.theme";
import { get, set } from "lodash-es";

export class BaseChartComponentState <T extends BaseChartComponentProps> extends BaseComponentState<T> {
  data: any = [];
  content: any = null;
  yAxis: Array<string> = [];
  legendData: any = [];
  theme: any;
  colors: any;
  xLabel: string = '';
  yLabel: string = '';
}

const screenWidth = Dimensions.get("window").width;

export abstract class BaseChartComponent<T extends BaseChartComponentProps, S extends BaseChartComponentState<T>, L extends BaseChartComponentStyles> extends BaseComponent<T, S, L> {
  public screenWidth = screenWidth;
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles as L, new BaseChartComponentProps() as T, new BaseChartComponentState() as S);
    let themeName = props.theme ? props.theme : (props.type === 'Pie' ? 'Azure' : 'Terrestrial');
    const colorsToUse = BaseChartTheme.getColorsObj(themeName);
    const themeToUse = BaseChartTheme.getTheme(themeName, this.props.styles);
      this.updateState({
        colors: colorsToUse,
        theme: themeToUse
      } as S);
  }

  // TODO: check if this works in all cases or not.
  overrideThemeStyle(styleObj: {[key: string]: any}) {
    let themeObj = this.state.theme;
    Object.keys(styleObj).forEach((k: string) => {
      set(themeObj, k, get(styleObj, k));
    });
    this.updateState({
      theme: themeObj
    } as S);
  }

  prepareLegendData() {
    if (this.state.yAxis) {
      let ldata = this.state.yAxis.map((d: string) => {
        return {
          name: d
        }
      });
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

  prepareDataItems(dataset: any) {
    let xaxis = this.props.xaxisdatakey;
    let yaxis = this.props.yaxisdatakey;
    let datasets: any = []
    let datapoints: Array<{[key: string] : any}> = [];

    if (xaxis && yaxis) {
      let yPts = yaxis.split(',');
      yPts.forEach((y: any, index: number) => {
        if (xaxis !== y) {
          datasets.push(dataset.map((o: {[key: string] : string}) => {
            return ({
              x: o[xaxis],
              y: o[y]
            });
          }));
        }
      });
      this.updateState({
        data: datasets as any,
        yAxis: yPts
      } as S, () => this.prepareLegendData());
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    let units = '';
    switch(name) {
      case 'dataset':
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
