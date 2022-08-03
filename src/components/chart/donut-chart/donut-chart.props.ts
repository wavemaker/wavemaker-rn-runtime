import WmPieChartProps from "@wavemaker/app-rn-runtime/components/chart/pie-chart/pie-chart.props";

export default class WmDonutChartProps extends WmPieChartProps {
  donutratio: number = 0.3;
  labeltype: string = 'percent';
}
