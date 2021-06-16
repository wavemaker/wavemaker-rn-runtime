import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDateProps extends BaseProps {
  datavalue?: string = null as any;
  defaultvalue?: string = null as any;
  datepattern?: string = 'MMM DD, YYYY';
  outputpattern?: string = 'YYYY-MM-DD';
  mindate?: string | Date = null as any;
  maxdate?: string | Date = null as any;
  placeholder? = 'Select date';
  readonly? = false;
}