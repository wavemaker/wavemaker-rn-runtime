import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';

export default class WmRadiosetProps extends BaseDatasetProps {
  dataset: any = 'Option 1, Option 2, Option 3';
  itemsperrow =  {
    xs: 1,
    sm: 1,
    md: 1,
    lg: 1,
 };
 renderitempartial?: (item: any, index: number, partialName: string)=> React.ReactNode;
}
