import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCalendarProps extends BaseProps {
  dataset: any[] = null as any;
  datavalue: string | number = null as any;
  eventstart: string = null as any;
  view: 'day' | 'month' | 'year' = 'day';
}