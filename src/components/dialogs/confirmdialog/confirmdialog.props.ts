import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmConfirmdialogProps extends BaseProps {
    title? = 'Confirm';
    iconclass? = 'wi wi-done';
    oktext? = 'Ok';
    caneltext? = 'CANCEL';
    message? = 'I am confirm box!';
    modal? = false;
    closable? = true;
    onOpened?: Function = null as any;
}