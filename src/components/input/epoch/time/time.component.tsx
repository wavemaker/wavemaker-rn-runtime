import WmTimeProps from './time.props';
import { DEFAULT_CLASS, } from './time.styles';
import BaseDatetime from '../base-datetime.component';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default class WmTime extends BaseDatetime {

  constructor(props: WmTimeProps) {
    super(props, DEFAULT_CLASS, new WmTimeProps());
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-time-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  onDateChange($event: DateTimePickerEvent, date?: Date): void {
    super.onDateChange($event, date);
  }

  get timestamp() {
    return this.state.dateValue;
  }

  renderWidget(props: WmTimeProps) {
    return super.renderWidget(props);
  }
}