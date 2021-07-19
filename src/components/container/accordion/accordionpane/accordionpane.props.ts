import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAccordionpaneProps extends BaseProps {
  children: any;
  iconclass: string = null as any;
  title: string = 'Title';
  renderPartial?: Function;
  isPartialLoaded = false;
  subheading: string = null as any;
  badgevalue: string = null as any;
  badgetype: string = null as any;
}
