import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmBottomsheetProps extends BaseProps {
    showonrender: boolean = false;
    bottomsheetheightratio:number = 0.3;
    children? = null as any;
    expand?:boolean = false;
    bottomsheetexpandedheightratio?:number = 0.5; 
    keyboardverticaloffset: number = 100;
    onOpened?: Function = null as any;
    onClose?: Function = null as any;
    modal?: boolean = true;
}