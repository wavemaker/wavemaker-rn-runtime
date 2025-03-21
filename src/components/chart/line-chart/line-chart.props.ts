import BaseChartComponentProps from "@wavemaker/app-rn-runtime/components/chart/basechart.props";
export default class WmLineChartProps extends BaseChartComponentProps {
  linethickness: number = 2;
  onSelect?: any;
  skeletonheight?: string = null as any;
  skeletonwidth?: string = null as any;
}
