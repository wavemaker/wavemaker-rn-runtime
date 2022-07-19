import { Dimensions } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import BaseChartComponentProps from "./basechart.props";
import { DEFAULT_CLASS, DEFAULT_STYLES, BaseChartComponentStyles} from "./basechart.styles";

export class BaseChartComponentState <T extends BaseChartComponentProps> extends BaseComponentState<T> {
  data: any = [];
  content: any = null;
}

const screenWidth = Dimensions.get("window").width;

export abstract class BaseChartComponent<T extends BaseChartComponentProps, S extends BaseChartComponentState<T>, L extends BaseChartComponentStyles> extends BaseComponent<T, S, L> {
  constructor(props: T, public defaultClass: string = DEFAULT_CLASS, defaultStyles: L = DEFAULT_STYLES as L, defaultProps?: T, defaultState?: S) {
    super(props, defaultClass, defaultStyles as L, new BaseChartComponentProps() as T, new BaseChartComponentState() as S);
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
      console.log(datasets);
      this.updateState({
        data: datasets as any
      } as S);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    super.onPropertyChange(name, $new, $old);
    switch(name) {
      case 'dataset':
        $new && this.prepareDataItems($new);
        break;

    }
  }
}
