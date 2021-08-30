import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmLabelProps extends BaseProps {
    animation?: string = null as any;
    caption?: string = 'Label';
    required?: boolean = null as any;
    isValid?: boolean = true;
}
