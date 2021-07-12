import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAccordionpaneProps extends BaseProps {
  children: any;
  iconclass: string = null as any;
  title: string = 'Tab Title';
  renderPartial?: Function;
  isPartialLoaded = false;
  subheading: any;
}
