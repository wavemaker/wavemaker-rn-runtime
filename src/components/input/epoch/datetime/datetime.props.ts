import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDatetimeProps extends BaseProps {
  mode = 'datetime';
  datavalue?: string | Date | number = null as any;
  datepattern?: string = '';
  outputformat?: string = 'timestamp';
  mindate?: string | Date = null as any;
  maxdate?: string | Date = null as any;
  placeholder? = 'Select date time';
  readonly? = false;
  onFieldChange?: any;
}
