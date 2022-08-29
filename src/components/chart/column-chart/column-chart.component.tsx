import React from 'react';

import WmColumnChartProps from './column-chart.props';
import WmBarChart, {WmBarChartState} from "@wavemaker/app-rn-runtime/components/chart/bar-chart/bar-chart.component";

export class WmColumnChartState extends WmBarChartState {}

export default class WmColumnChart extends WmBarChart {

  constructor(props: WmColumnChartProps) {
    super(props)
  }
}
