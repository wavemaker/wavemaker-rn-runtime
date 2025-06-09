import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmBottomsheetProps extends BaseProps {
    visible: boolean = false;
    sheetheightratio:number = 0.3;
    children? = null as any;
    bottompopup?:boolean = false;
    expandedheightratio?:number = 0.5; 
    onClose?: Function = null as any;

}