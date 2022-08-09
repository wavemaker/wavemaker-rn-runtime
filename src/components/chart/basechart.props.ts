import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class BaseChartComponentProps extends BaseProps {
  xaxisdatakey: string = '';
  yaxisdatakey: string = '';
  dataset: any;
  type: string = '';
  title: string = '';
  theme: string = '';
  xaxislabel: string = '';
  xunits: string = '';
  staggerlabels: boolean = false;
  yaxislabel: string = '';
  yunits: string = '';
  yaxislabeldistance: number = 50;
  xaxislabeldistance: number = 30;
  customcolors: string | Array<string> = '';
  legendheight: number = 0;
  labellegendheight: number = 0;
  labeltype: string = 'percent';
  bubblesize: string= '';
  shape: string = '';
  loadingicon='fa fa-circle-o-notch fa-pulse';
  loadingdatamsg = 'Loading...';
  nodatamessage = 'No data found';
  offsetbottom: number = 50;
  offsettop: number = 70;
  offsetleft: number = 65;
  offsetright: number = 25;
  showlegend: string = 'top';
  showlabels: string = 'outside';
  tooltips: boolean = false;
  interpolation: string = 'linear';
  highlightpoints: boolean = false;
  showvalues: boolean = false;
}
