import React from 'react';
import { TextInput } from 'react-native';
import { isString } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTextProps from './text.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextStyles } from './text.styles';

export class WmTextState extends BaseComponentState<WmTextProps> {
  datavalue: any;
  keyboardType: any = 'default';
}

export default class WmText extends BaseComponent<WmTextProps, WmTextState, WmTextStyles> {

  constructor(props: WmTextProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmTextProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'type':
        let keyboardType;
        if (this.props.type === 'number') {
          keyboardType = 'numeric';
        } else if (this.props.type === 'tel') {
          keyboardType = 'phone-pad';
        } else if (this.props.type === 'email') {
          keyboardType = 'email-address';
        }
        this.updateState({
          keyboardType: keyboardType,
        } as WmTextState);
        break;

    }
  }

  onChange(event: any) {
    if (this.props.updateon === 'default') {
      this.updateDatavalue(event.target.value, event);
    }
  }

  handleValidation(value: any) {
    if (this.props.regexp) {
      const condition = new RegExp(this.props.regexp, 'g');
      return condition.test(value);
    }
    return true;
  }

  updateDatavalue(value: any, event?: any) {
    const oldValue = this.state.datavalue;

    // autotrim
    if (this.props.autotrim && this.state.datavalue && isString(this.state.datavalue)) {
      value = value.trim();
    }

    // regex validation
    const valid = this.handleValidation(value);
    if (!valid) {
      this.invokeEventCallback('onError', [ event, this.proxy, value, oldValue ]);
      return;
    }

    this.updateState({
      props: {
        datavalue: value,
      },
    } as WmTextState);
    this.invokeEventCallback('onChange', [ event, this.proxy, value, oldValue ]);
  }

  onBlur(event: any) {
    if (this.props.updateon === 'blur') {
      this.updateDatavalue(event.target.value, event);
    }

    this.invokeEventCallback('onBlur', [ event, this.proxy]);
  }

  onFocus(event: any) {
    this.invokeEventCallback('onFocus', [ event, this.proxy]);
  }

  onKeyPress(event: any) {
    this.invokeEventCallback('onKeyPress', [ event, this.proxy]);
  }

  renderWidget(props: WmTextProps) {
    return (
        <TextInput
          style={this.styles.root}
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
          onChange={this.onChange.bind(this)}
        />
    );
  }
}
