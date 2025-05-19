import { TooltipDirection } from '../../basic/tooltip/tooltip.props';
import BaseDatasetProps from '../basedataset/basedataset.props';

export default class WmSliderProps extends BaseDatasetProps {
    range?: boolean = false;
    minvalue: number = 0;
    maxvalue: number = 100;
    step?: number = 1;
    datatype: 'number' | 'dataset' = "number";
    showmarkers = false;
    showtooltip? = false;
    tooltipdirection?: TooltipDirection = "up";
    markerlabeltext?: Array<string | number | {title: string, position?: string}> | string = [];
    getToolTipExpression?: (item: number) => string;
}
