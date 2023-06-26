import React from 'react';
import { Platform, TextInput } from 'react-native';
import { isNull } from 'lodash';

import WmNumberProps from './number.props';
import { DEFAULT_CLASS, WmNumberStyles } from './number.styles';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';

export class WmNumberState extends BaseNumberState<WmNumberProps> {
  keyboardType: any;
}

export default class WmNumber extends BaseNumberComponent<WmNumberProps, WmNumberState, WmNumberStyles> {

  constructor(props: WmNumberProps) {
    super(props, DEFAULT_CLASS, new WmNumberProps(), new WmNumberState());
  }

  renderWidget(props: WmNumberProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return (<TextInput
      ref={ref => {this.widgetRef = ref;
        // @ts-ignore
        if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
          // @ts-ignore
          ref.selectionStart = ref.selectionEnd = this.cursor;
        }}}
      {...opts}
      style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid]}
      keyboardType="numeric"
      placeholderTextColor={this.styles.placeholderText.color as any}
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
