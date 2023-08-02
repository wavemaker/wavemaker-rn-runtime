import BaseChartComponentProps from '@wavemaker/app-rn-runtime/components/chart/basechart.props';
import { VictorySliceLabelPlacementType } from 'victory-pie';

export default class WmPieChartProps extends BaseChartComponentProps {
  donutratio: number = 0;
  labelplacement: VictorySliceLabelPlacementType = 'vertical';
  centerlabel = '';
}
