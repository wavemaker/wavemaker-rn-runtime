import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';
import {PROP_STRING} from "../../../../../wavemaker-ng-runtime/libraries/components/base";

export default class WmSearchProps extends BaseDatasetProps {
  autofocus: boolean = false;
  searchKey: any;
  type: string = 'search';
  datacompletemsg: string = 'No more data to load';
  placeholder: string = 'Search';
  dataset: any;
  limit: number = null as any;
  minchars: number = null as any;
  imagewidth: any = 16;
  searchon: string = 'typing';
  onSubmit?: any;
  showclear: boolean = false;
  showSearchIcon: boolean = true; // internal property
}