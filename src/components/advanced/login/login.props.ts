import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmLoginProps extends BaseProps {
    children: any;
    onLogin: Function = () => {};
    showerror: boolean = true;
}