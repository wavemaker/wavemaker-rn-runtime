import WmDateProps from './date.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './date.styles';
import BaseDatetime from '../base-datetime.component';

export default class WmDate extends BaseDatetime {

  constructor(props: WmDateProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDateProps());
  }

  renderWidget(props: WmDateProps) {
    return super.renderWidget(props);
  }
}
