import React from 'react';

import WmDonutChartProps from './donut-chart.props';
import WmPieChart, {WmPieChartState} from "@wavemaker/app-rn-runtime/components/chart/pie-chart/pie-chart.component";

export class WmDonutChartState extends WmPieChartState {
}

export default class WmDonutChart extends WmPieChart {

  constructor(props: WmDonutChartProps) {
    super(props);
  }
  componentDidMount() {
    super.componentDidMount();
    if (this.chartHeight) {
      // 0.3 is the ratio that is considered for innerradius
      this.updateState({
        props: {
          innerradius: 0.3 * this.chartHeight
        }
      } as WmDonutChartState);
    }
  }
}
