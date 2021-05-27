import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmNavbarProps extends BaseProps {
    title: string = '';
    backbutton = true;
    backbuttonlabel = '';
    showDrawerButton = false;
    leftnavpaneliconclass = 'wi wi-menu';
    backbuttoniconclass = 'wi wi-back';
    imgsrc = '';
    searchbutton = false;
    searchbuttoniconclass = 'wi wi-search'
}
