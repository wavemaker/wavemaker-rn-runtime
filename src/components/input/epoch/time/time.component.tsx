import WmTimeProps from './time.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './time.styles';
import BaseDatetime from '../base-datetime.component';

export default class WmTime extends BaseDatetime {

  constructor(props: WmTimeProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTimeProps());
  }

  onDateChange($event: Event, date?: Date): void {
    super.onDateChange($event, date);
  }

  get timestamp() {
    return this.state.dateValue;
  }

  renderWidget(props: WmTimeProps) {
    return super.renderWidget(props);
  }
}