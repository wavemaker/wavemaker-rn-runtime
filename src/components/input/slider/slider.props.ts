import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmSliderProps extends BaseProps {
    datavalue: any;
    minvalue: number = 0;
    maxvalue: number = 100;
    step: number = 1;
    readonly = false;
    disabled? = false;
    onFieldChange: any;
}
