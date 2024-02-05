import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import { TooltipDirection } from '../../basic/tooltip/tooltip.props';

export default class WmSliderProps extends BaseProps {
    isrange?: boolean = false;
    datavalue: any;
    minvalue: number = 0;
    maxvalue: number = 100;
    step?: number = 1;
    markerstep?: number = undefined;
    showtooltip?: boolean = false;
    tooltipdirection?: TooltipDirection = "up";
    markerlabeltext?: Array<string | number> = [];
    lowthumbtooltiplabelexpr?: (item: number) => string;
    highthumbtooltiplabelexpr?: (item: number) => string;
    readonly? = false;
    onFieldChange?: any;
}
