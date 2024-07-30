import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmConfirmdialogProps extends BaseProps {
    animation: string = null as any;
    animationdelay: number = null as any;
    title? = 'Confirm';
    iconclass? = 'wm-sl-l sl-check';
    oktext? = 'Ok';
    canceltext? = 'CANCEL';
    message? = 'I am confirm box!';
    modal? = false;
    closable? = true;
    onOpened?: Function = null as any;
    iconurl?: string = null as any;
    iconheight?: number = null as any;
    iconwidth?: number = null as any;
    iconmargin?: number = null as any;
}
