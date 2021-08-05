import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';

export default class WmChipsProps extends BaseDatasetProps {
  autofocus: boolean = false;
  placeholder: string = 'Type here...';
  dataset: any = 'Option 1, Option 2, Option 3';
  searchkey: string = null as any;
  minchars: number = 1;
  inputwidth: string = 'default';
  maxsize: number = null as any;
}
