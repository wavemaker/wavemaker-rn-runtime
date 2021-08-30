import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmConfirmdialogProps extends BaseProps {
    animation: string = null as any;
    title? = 'Confirm';
    iconclass? = 'wi wi-done';
    oktext? = 'Ok';
    canceltext? = 'CANCEL';
    message? = 'I am confirm box!';
    modal? = false;
    closable? = true;
    onOpened?: Function = null as any;
}
