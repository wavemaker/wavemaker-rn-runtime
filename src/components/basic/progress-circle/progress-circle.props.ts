import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmProgressCircleProps extends BaseProps {
  type: 'default' | 'success' | 'info' | 'warning' | 'error' = 'default';
  datavalue: number = 30;
  minvalue: number = 0;
  maxvalue: number = 100;
  captionplacement: string = 'inside';
}