import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';

export default class WmCheckboxsetProps extends BaseDatasetProps {
  dataset: any = 'Option 1, Option 2, Option 3';
  displayValue: any = '';
  required: boolean = false;
  itemsperrow =  {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1,
 };
}
