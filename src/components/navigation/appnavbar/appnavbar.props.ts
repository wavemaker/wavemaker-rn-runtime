import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAppNavbarProps extends BaseProps {
    children?: any;
    title: string = '';
    backbutton = true;
    backbuttonlabel = '';
    showDrawerButton = false;
    leftnavpaneliconclass = 'wm-sl-l sl-hamburger-menu';
    backbuttoniconclass = 'wi wi-back';
    imgsrc = null as any;
    searchbutton = false;
    searchbuttoniconclass = 'wm-sl-l sl-search';
    badgevalue?: string;
    hideonscroll?: boolean;
}
