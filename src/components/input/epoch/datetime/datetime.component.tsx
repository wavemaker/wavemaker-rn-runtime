import WmDatetimeProps from './datetime.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './datetime.styles';
import BaseDatetime from '../base-datetime.component';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';

export default class WmDatetime extends BaseDatetime {

  constructor(props: WmDatetimeProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmDatetimeProps());
    if (!props.datepattern) {
      this.updateFormat('datepattern',AppI18nService.dateTimeFormat);
    }
  }

  renderWidget(props: WmDatetimeProps) {
    return super.renderWidget(props);
  }
}