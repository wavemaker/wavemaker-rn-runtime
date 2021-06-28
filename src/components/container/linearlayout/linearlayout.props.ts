import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';

export default class WmLinearlayoutProps extends BaseProps {
    children? = [] as any[];
    direction: 'row'|'row-reverse' | 'column' | 'column-reverse' = 'row';
    horizontalalign: 'left' | 'center' | 'right' = 'left';
    verticalalign: 'top' | 'center' | 'bottom' = 'top';
    spacing = 0;
}