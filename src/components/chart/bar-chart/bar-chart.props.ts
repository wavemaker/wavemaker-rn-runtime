import BaseChartComponentProps from "@wavemaker/app-rn-runtime/components/chart/basechart.props";

export default class WmBarChartProps extends BaseChartComponentProps {
  horizontal?: boolean = true;
  viewtype: string = 'Grouped';
  onSelect?: any;
  barwidth?: number;
}
