import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmRatingProps extends BaseProps {
    dataset?: any[] = null as any;
    datafield?: string = 'key';
    displayfield?: string = 'value';
    getDisplayExpression: Function = null as any;
    datavalue?: number = null as any;
    maxvalue: number = 5;
    readonly? = false;
    iconcolor?: string = null as any;
    iconsize?: number = null as any;
    showcaptions? = true;
    onFieldChange: any;
}
