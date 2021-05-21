import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmNavbarProps extends BaseProps {
    title: string = '';
    backbutton = true;
    showDrawerButton = false;
    leftnavpaneliconclass = 'wi wi-menu';
    backbuttoniconclass = 'wi wi-back';
}