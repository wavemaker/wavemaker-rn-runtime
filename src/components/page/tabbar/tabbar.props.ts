import { BaseNavProps } from '../../navigation/basenav/basenav.props';

export default class WmTabbarProps extends BaseNavProps {
  morebuttoniconclass = 'wi wi-more-horiz';
  morebuttonlabel = 'more';
  isActive = (item: any) => false;
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
    }]
}
