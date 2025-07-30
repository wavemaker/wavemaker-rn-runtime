import { BaseNavProps } from '../../navigation/basenav/basenav.props';
import WmTabbar from './tabbar.component';

export default class WmTabbarProps extends BaseNavProps {
  morebuttoniconclass? = 'wi wi-more-horiz';
  morebuttonlabel? = 'more';
  itemchildren?: string = 'children';
  isActive? = (item: any) => false;
  onSelect? : (event: any, widget: WmTabbar) => any;
  dataset?: any = [{
      'label' : 'Home',
      'icon'  : 'wm-sl-r sl-home'
    },{
      'label' : 'Analytics',
      'icon'  : 'wm-sl-r sl-graph-ascend'
    },{
      'label' : 'Alerts',
      'icon'  : 'wm-sl-r sl-alarm-bell'
    },{
      'label' : 'Settings',
      'icon'  : 'wm-sl-r sl-settings'
  }];
  hideonscroll: boolean = false;
}
