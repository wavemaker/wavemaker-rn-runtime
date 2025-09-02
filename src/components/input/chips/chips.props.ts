import BaseDatasetProps from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.props';

export default class WmChipsProps extends BaseDatasetProps {
  autofocus: boolean = false;
  placeholder: string = 'Type here...';
  dataset: any = 'Option 1, Option 2, Option 3';
  searchable: boolean = false;
  searchkey: string = null as any;
  minchars: number = 1;
  maxsize: number = null as any;
  inputposition: string = 'last';
  selectionmode?:  'single' | 'multiple' = 'multiple';
  invokeEvent?: Function;
  selectediconclass: string = 'wm-sl-l sl-check'; 
  lefticonclass: string = null as any;       
  leftbadge: string = null as any;             
  righticonclass: string = null as any;          
  rightbadge: string = null as any;
  // Array props for bind: expressions (pre-resolved at code-gen)
  getLeftIconClassName?: string[];
  getRightIconClassName?: string[];
  getLeftBadge?: string[];
  getRightBadge?: string[];                   
}
