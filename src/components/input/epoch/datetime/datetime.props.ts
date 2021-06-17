import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDatetimeProps extends BaseProps {
  mode = 'datetime';
  datavalue?: string | Date = null as any;
  datepattern?: string = 'MMM D, yyyy h:mm:ss a';
  outputformat?: string = 'timestamp';
  mindate?: string | Date = null as any;
  maxdate?: string | Date = null as any;
  placeholder? = 'Select date time';
  readonly? = false;
}