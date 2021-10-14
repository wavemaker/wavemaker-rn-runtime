import { BaseProps } from '@wavemaker/app-rn-runtime/core/base.component';
import BaseDatasetProps from '../basedataset/basedataset.props';

export default class WmSwitchProps extends BaseDatasetProps {
  dataset: any = 'yes, no, maybe';
  dataItems: any;
  iconclass: any;
}
