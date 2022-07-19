import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseChartComponentProps extends BaseProps {
  xaxisdatakey: string = '';
  yaxisdatakey: string = '';
  dataset: any;
  type: string = '';
  title: string = '';
}
