import React from 'react';
import { TextInput } from 'react-native';

import WmTextProps from './text.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextStyles } from './text.styles';
import { BaseInputComponent, BaseInputState } from "@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component";

export class WmTextState extends BaseInputState<WmTextProps> {
}

export default class WmText extends BaseInputComponent<WmTextProps, WmTextState, WmTextStyles> {

  constructor(props: WmTextProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTextProps());
  }

  renderWidget(props: WmTextProps) {
    return (
        <TextInput
          style={[this.styles.root, {borderBottomWidth: this.state.isValid === false ? 1 : 0, borderBottomColor: this.state.isValid === false ? 'red' : 'green'}]}
          keyboardType={this.state.keyboardType}
          defaultValue={props.datavalue}
          autoCompleteType={props.autocomplete ? 'username' : 'off'}
          autoFocus={props.autofocus}
          editable={props.disabled || props.readonly ? false : true}
          secureTextEntry={props.type === 'password' ? true : false}
          maxLength={props.maxchars}
          placeholder={props.placeholder}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
        />
    );
  }
}
