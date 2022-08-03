import React from 'react';

import WmDonutChartProps from './donut-chart.props';
import WmPieChart from "@wavemaker/app-rn-runtime/components/chart/pie-chart/pie-chart.component";


export default class WmDonutChart extends WmPieChart {

  constructor(props: WmDonutChartProps) {
    super(props);
    if (props.donutratio) {
      this.setInnerRadius();
    }
  }
}
