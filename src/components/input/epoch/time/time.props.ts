import WmDatetimeProps from '../datetime/datetime.props';

export default class WmDateProps extends WmDatetimeProps {
  public timepattern = 'h:mm:ss a';
  constructor() {
    super();
    this.mode = 'time';
    this.placeholder = 'Select time';
    this.datepattern = this.timepattern;
    this.outputformat = 'HH:mm:ss';
  }
}