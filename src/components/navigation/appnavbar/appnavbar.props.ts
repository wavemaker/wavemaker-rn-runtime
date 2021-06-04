import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmAppNavbarProps extends BaseProps {
    children?: any;
    title: string = '';
    backbutton = true;
    backbuttonlabel = '';
    showDrawerButton = false;
    leftnavpaneliconclass = 'wi wi-menu';
    backbuttoniconclass = 'wi wi-back';
    imgsrc = null as any;
    searchbutton = false;
    searchbuttoniconclass = 'wi wi-search'
}
