import React from 'react';
import { Text } from 'react-native';
import WmSelectProps from './select.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmSelectStyles } from './select.styles';
import {
  BaseDatasetComponent,
  BaseDatasetState
} from '@wavemaker/app-rn-runtime/components/input/basedataset/basedataset.component';

export class WmSelectState extends BaseDatasetState<WmSelectProps> {}

export default class WmSelect extends BaseDatasetComponent<WmSelectProps, WmSelectState, WmSelectStyles> {

  constructor(props: WmSelectProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmSelectProps());
  }

  onFocus(event: any) {
    this.invokeEventCallback('onFocus', [ event, this.proxy]);
  }

  onBlur(event: any) {
    this.invokeEventCallback('onBlur', [ event, this.proxy]);
  }

  renderChild(item: any, index: any) {
    const displayText = item.displayexp || item.displayfield;
    return null;
  }

  renderWidget(props: WmSelectProps) {
    const items = this.state.dataItems;
    return <Text>Select component is coming soon </Text>;
  }
}
