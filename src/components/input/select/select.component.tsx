import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

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
    const displayText = item.displayexp || item.displayfield || item.datafield;
    return (
      <Picker.Item label={displayText} value={this.state.props.datafield === 'All Fields' ? this.getItemKey(item.datafield) : item.datafield} key={item.key} />
      )
  }

  renderWidget(props: WmSelectProps) {
    const items = this.state.dataItems;
    return (<View style={{height: this.styles.root.height}}>
      <Picker
      style={this.styles.root}
      itemStyle={{height: this.styles.root.height}}
      selectedValue={this.state.props.datafield === 'All Fields' ? this.getItemKey(props.datavalue): (props.datavalue === null ? undefined : props.datavalue)}
      onValueChange={this.onValueChange.bind(this)}
      enabled={!props.disabled}
      onFocus={this.onFocus.bind(this)}
      onBlur={this.onBlur.bind(this)}>
      {props.placeholder || (!props.placeholder && !props.datavalue) ?
        <Picker.Item label={props.placeholder || ''} value={''} key={props.name + '_placeholder'}/> : null}
      {items && items.length ?
        items.map((item: any, index: any) => this.renderChild(item, index)): null}
      </Picker>
    </View>);
  }
}
