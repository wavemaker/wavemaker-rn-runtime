import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmPanelProps extends BaseProps {
  animation: string = null as any;
  children: any;
  collapsible: boolean = null as any;
  iconclass: string = null as any;
  title: string = 'Title';
  renderPartial?: Function;
  subheading: string = null as any;
  badgevalue: string = null as any;
  badgetype: string = 'default';
  expanded: boolean = true;
  iconurl?: string = null as any;
  iconheight?: number = null as any;
  iconwidth?: number = null as any;
  iconmargin?: number = null as any;
}

