import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmCompositeProps extends BaseProps {
    children: any;
    captionposition: 'left' | 'right' | 'top' | undefined = undefined;
}