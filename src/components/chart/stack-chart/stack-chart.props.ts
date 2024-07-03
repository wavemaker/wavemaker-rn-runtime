import BaseChartComponentProps from '@wavemaker/app-rn-runtime/components/chart/basechart.props';

export default class WmStackChartProps extends BaseChartComponentProps {
  viewtype: string = 'Bar';
  showlegend: string = 'left';
  thickness: number = 30;
  offsetleft: number = 25;
  offsetright: number = 35;
  onSelect?: any;
  minvalue: number = 0;
}
