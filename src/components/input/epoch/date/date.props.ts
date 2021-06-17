import WmDatetimeProps from '../datetime/datetime.props';

export default class WmDateProps extends WmDatetimeProps {
  constructor() {
    super();
    this.mode = 'date';
    this.placeholder = 'Select date';
    this.datepattern = 'MMM DD, YYYY';
    this.outputformat = 'YYYY-MM-DD';
  }
}