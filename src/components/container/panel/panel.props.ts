import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmPanelProps extends BaseProps {
  children: any;
  collapsible: boolean = null as any;
  iconclass: string = null as any;
  title: string = 'Title';
  renderPartial?: Function;
  isPartialLoaded = false;
  subheading: string = null as any;
  badgevalue: string = null as any;
  badgetype: string = 'default';
  expanded: boolean = true;
}