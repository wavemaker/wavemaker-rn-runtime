import WmDatetimeProps from './datetime.props';
import { DEFAULT_CLASS, } from './datetime.styles';
import BaseDatetime from '../base-datetime.component';

export default class WmDatetime extends BaseDatetime {

  constructor(props: WmDatetimeProps) {
    super(props, DEFAULT_CLASS, new WmDatetimeProps());
  }

  renderWidget(props: WmDatetimeProps) {
    return super.renderWidget(props);
  }
}