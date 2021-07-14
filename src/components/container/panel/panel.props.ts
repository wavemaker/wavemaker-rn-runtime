import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmPanelProps extends BaseProps {
  children: any;
  collapsible: any;
  iconclass: string = null as any;
  title: string = 'Title';
  renderPartial?: Function;
  isPartialLoaded = false;
  subheading: any;
  badgevalue: any;
  badgetype: any = 'default';
  expanded: any = true;
}
