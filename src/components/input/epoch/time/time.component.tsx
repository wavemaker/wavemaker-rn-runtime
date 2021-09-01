import WmTimeProps from './time.props';
import { DEFAULT_CLASS, DEFAULT_STYLES } from './time.styles';
import BaseDatetime from '../base-datetime.component';
import AppI18nService from '@wavemaker/app-rn-runtime/runtime/services/app-i18n.service';

export default class WmTime extends BaseDatetime {

  constructor(props: WmTimeProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTimeProps());
    if (!props.timepattern) {
      this.updateFormat('datepattern', AppI18nService.timeFormat);
    } else {
      this.updateFormat('datepattern', props.timepattern);
    }
  }

  renderWidget(props: WmTimeProps) {
    return super.renderWidget(props);
  }
}