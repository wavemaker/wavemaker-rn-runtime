import WmDateProps from './date.props';
import { DEFAULT_CLASS } from './date.styles';
import BaseDatetime from '../base-datetime.component';

export default class WmDate extends BaseDatetime {

  constructor(props: WmDateProps) {
    super(props, DEFAULT_CLASS, new WmDateProps());
  }

  public getStyleClassName(): string | undefined {
    const classes = [];
    if (this.state.props.floatinglabel) {
      classes.push('app-date-with-label'); 
    }
    classes.push(super.getStyleClassName());
    return classes.join(' ');
  }

  renderWidget(props: WmDateProps) {
    return super.renderWidget(props);
  }
}
