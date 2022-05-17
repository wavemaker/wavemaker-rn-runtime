import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmDatetimeProps extends BaseProps {
  mode = 'datetime';
  datavalue?: string | Date | number = undefined as any;
  datepattern?: string = '';
  outputformat?: string = 'timestamp';
  mindate?: string | Date = undefined as any;
  maxdate?: string | Date = undefined as any;
  placeholder? = 'Select date time';
  readonly? = false;
  onFieldChange?: any;
  locale: string = '';
  triggerValidation?: any;
}
