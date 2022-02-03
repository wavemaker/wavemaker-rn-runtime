import React from 'react';
import { TextInput } from 'react-native';

import WmTextProps from './text.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextStyles } from './text.styles';
import { BaseInputComponent, BaseInputState } from "@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component";
import { isNull } from 'lodash';

export class WmTextState extends BaseInputState<WmTextProps> {
}

export default class WmText extends BaseInputComponent<WmTextProps, WmTextState, WmTextStyles> {

  constructor(props: WmTextProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTextProps(), new WmTextState());
  }

  renderWidget(props: WmTextProps) {
    return (
        <TextInput
          ref={ref => {this.widgetRef = ref;
            // @ts-ignore
          if (ref && !isNull(ref.selectionStart) && !isNull(ref.selectionEnd)) {
            // @ts-ignore
            ref.selectionStart = ref.selectionEnd = this.cursor;
          }}}
          placeholderTextColor={this.styles.placeholderText.color as any}
          defaultValue={this.state.textValue || ''}
          style={[this.styles.root, this.state.isValid ? {} : this.styles.invalid]}
          keyboardType={this.state.keyboardType}
          autoComplete={props.autocomplete ? 'username' : 'off'}
          autoFocus={props.autofocus}
          editable={props.disabled || props.readonly ? false : true}
          secureTextEntry={props.type === 'password' ? true : false}
          maxLength={props.maxchars}
          placeholder={props.placeholder}
          onBlur={this.onBlur.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
          onChange={this.invokeChange.bind(this)}
        />
    );
  }
}
