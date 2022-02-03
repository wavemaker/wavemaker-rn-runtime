import React from 'react';
import { TextInput } from 'react-native';

import WmNumberProps from './number.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmNumberStyles } from './number.styles';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';

export class WmNumberState extends BaseNumberState<WmNumberProps> {
  keyboardType: any;
}

export default class WmNumber extends BaseNumberComponent<WmNumberProps, WmNumberState, WmNumberStyles> {

  constructor(props: WmNumberProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmNumberProps(), new WmNumberState());
  }

  renderWidget(props: WmNumberProps) {
    return (<TextInput
      ref={ref => {this.widgetRef = ref;
        // @ts-ignore
        if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
          // @ts-ignore
          ref.selectionStart = ref.selectionEnd = this.cursor;
        }}}
      defaultValue={this.state.textValue.toString() || ''}
      style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid]}
      keyboardType="numeric"
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      placeholder={props.placeholder}
      onBlur={this.onBlur.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.validateInputEntry.bind(this)}
      onChangeText={this.onChangeText.bind(this)}
      onChange={this.invokeChange.bind(this)}
    />);
  }
}
