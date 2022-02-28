import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';

export default class WmSearchProps extends BaseDatasetProps {
  autofocus: boolean = false;
  query?: string = '';
  searchkey?: any;
  type: 'search' | 'autocomplete' = 'search';
  datacompletemsg?: string = 'No more data to load';
  placeholder?: string = 'Search';
  limit?: number = null as any;
  minchars?: number = null as any;
  imagewidth?: any = 32;
  imageheight?: any = 32;
  searchon?: string = 'typing';
  onSubmit?: any;
  onChange?: Function = null as any;
  result?: any;
  showclear: boolean = false;
  showSearchIcon: boolean = true; // internal property
}
