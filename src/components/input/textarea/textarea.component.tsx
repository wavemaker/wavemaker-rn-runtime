import React from 'react';
import { TextInput } from 'react-native';
import WmTextareaProps from './textarea.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextareaStyles } from './textarea.styles';
import {
  BaseInputComponent,
  BaseInputState
} from '@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component';
import { isNull } from 'lodash';

export class WmTextareaState extends BaseInputState<WmTextareaProps> {}

export default class WmTextarea extends BaseInputComponent<WmTextareaProps, WmTextareaState, WmTextareaStyles> {

  constructor(props: WmTextareaProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTextareaProps(), new WmTextareaState());
  }

  renderWidget(props: WmTextareaProps) {
    return ( <TextInput
      ref={ref => {this.widgetRef = ref;
        // @ts-ignore
        if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
          // @ts-ignore
          ref.selectionStart = ref.selectionEnd = this.cursor;
        }}}
      placeholderTextColor={this.styles.placeholderText.color as any}
      style={[this.styles.root, this.styles.text, this.state.isValid ? {} : this.styles.invalid]}
      multiline={true}
      numberOfLines={4}
      keyboardType={this.state.keyboardType}
      defaultValue={this.state.textValue || ''}
      autoComplete={props.autocomplete ? 'username' : 'off'}
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      maxLength={props.maxchars}
      placeholder={props.placeholder}
      onBlur={this.onBlur.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.onKeyPress.bind(this)}
      onChangeText={this.onChangeText.bind(this)}
      onChange={this.invokeChange.bind(this)}
    />);
  }
}
