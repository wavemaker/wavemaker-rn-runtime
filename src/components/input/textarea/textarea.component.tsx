import React from 'react';
import { TextInput } from 'react-native';
import WmTextareaProps from './textarea.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextareaStyles } from './textarea.styles';
import {
  BaseInputComponent,
  BaseInputState
} from '@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component';

export class WmTextareaState extends BaseInputState<WmTextareaProps> {}

export default class WmTextarea extends BaseInputComponent<WmTextareaProps, WmTextareaState, WmTextareaStyles> {

  constructor(props: WmTextareaProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTextareaProps());
  }

  renderWidget(props: WmTextareaProps) {
    return ( <TextInput
      style={[this.styles.root, {borderBottomWidth: this.state.isValid === false ? 1 : 0, borderBottomColor: this.state.isValid === false ? 'red' : 'green'}]}
      multiline={true}
      numberOfLines={3}
      keyboardType={this.state.keyboardType}
      defaultValue={props.datavalue}
      autoCompleteType={props.autocomplete ? 'username' : 'off'}
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      maxLength={props.maxchars}
      placeholder={props.placeholder}
      onBlur={this.onBlur.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.onKeyPress.bind(this)}
      onChangeText={this.onChangeText.bind(this)}
    />);
  }
}