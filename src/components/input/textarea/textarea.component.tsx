import React from 'react';
import { Platform, TextInput, View } from 'react-native';
import WmTextareaProps from './textarea.props';
import { DEFAULT_CLASS, WmTextareaStyles } from './textarea.styles';
import {
  BaseInputComponent,
  BaseInputState
} from '@wavemaker/app-rn-runtime/components/input/baseinput/baseinput.component';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import { isNull } from 'lodash';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils';

export class WmTextareaState extends BaseInputState<WmTextareaProps> {}

export default class WmTextarea extends BaseInputComponent<WmTextareaProps, WmTextareaState, WmTextareaStyles> {

  constructor(props: WmTextareaProps) {
    super(props, DEFAULT_CLASS, new WmTextareaProps(), new WmTextareaState());
  }

  renderWidget(props: WmTextareaProps) {
    let opts: any = {};
    const valueExpr = Platform.OS === 'web' ? 'value' : 'defaultValue';
    opts[valueExpr] = this.state.textValue?.toString() || '';
    return ( <WMTextInput
      {...this.getTestPropsForInput()}
      {...getAccessibilityProps(
        AccessibilityWidgetType.TEXTAREA,
        props
      )}
      ref={(ref: any) => {this.widgetRef = ref;
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
      {...opts}
      autoComplete={props.autocomplete ? 'username' : 'off'}
      autoFocus={props.autofocus}
      editable={props.disabled || props.readonly ? false : true}
      maxLength={props.maxchars}
      placeholder={props.placeholder || 'Place your text'}
      onBlur={this.onBlur.bind(this)}
      onFocus={this.onFocus.bind(this)}
      onKeyPress={this.onKeyPress.bind(this)}
      onChangeText={this.onChangeText.bind(this)}
      onChange={this.invokeChange.bind(this)}
      allowContentSelection={this.styles.text.userSelect === 'text'}
    />);
  }
}
