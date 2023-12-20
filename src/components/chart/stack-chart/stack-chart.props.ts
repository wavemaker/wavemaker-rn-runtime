import BaseChartComponentProps from '@wavemaker/app-rn-runtime/components/chart/basechart.props';

export default class WmStackChartProps extends BaseChartComponentProps {
  viewtype: string = 'Bar';
  showlegend: string = 'left';
  thickness: number = 20;
  offsetleft: number = 25;
  offsetright: number = 35;
  onSelect?: any;
}
