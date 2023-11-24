import React from 'react';
import { Platform } from 'react-native';
import { isNull } from 'lodash';

import WmNumberProps from './number.props';
import { DEFAULT_CLASS, WmNumberStyles } from './number.styles';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import {
  BaseNumberComponent,
  BaseNumberState
} from '@wavemaker/app-rn-runtime/components/input/basenumber/basenumber.component';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/utils';

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
    return (<WMTextInput
      {...this.getTestPropsForInput()}
      {...getAccessibilityProps(AccessibilityWidgetType.NUMBER, props)}
      ref={(ref: any) => {this.widgetRef = ref;
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
      allowContentSelection={this.styles.text.userSelect === 'text'}
    />);
  }
}
