import React from 'react';
import { TextInput, View } from 'react-native';
import { isString } from 'lodash';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmTextProps from './text.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmTextStyles } from './text.styles';

export class WmTextState extends BaseComponentState<WmTextProps> {
  keyboardType: any = 'default';
  isValid: boolean = true;
}

export default class WmText extends BaseComponent<WmTextProps, WmTextState, WmTextStyles> {
  isTouched: boolean = false;
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
      case 'datavalue':
        console.log("datavalue changeddddddddd", $new);
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);

    }
  }

  onChange(event: any) {
    if (this.state.props.updateon === 'default') {
      this.updateDatavalue(event.target.value, event);
    }
  }

  handleValidation(value: any) {
    const props = this.state.props;
    if (props.regexp) {
      const condition = new RegExp(props.regexp, 'g');
      return condition.test(value);
    }
    return true;
  }

  updateDatavalue(value: any, event?: any, source?: any) {
    const props = this.state.props;
    const oldValue = props.datavalue;

    // autotrim
    if (props.autotrim && props.datavalue && isString(props.datavalue)) {
      value = value.trim();
    }

    // regex validation
    const valid = this.handleValidation(value);
    const isValid = this.props.required && source && !value ? false : true;
    this.updateState({
      isValid: isValid
    } as WmTextState);
    if (!valid) {
      this.invokeEventCallback('onError', [ event, this.proxy, value, oldValue ]);
      return;
    }

    this.updateState({
      props: {
        datavalue: value
      }
    } as WmTextState, () => this.invokeEventCallback('onChange', [ event, this.proxy, value, oldValue ]))

  }

  onBlur(event: any) {
    this.isTouched = true;
    if (this.state.props.updateon === 'blur') {
      this.updateDatavalue(event.target.value, event, 'blur');
    }

    this.invokeEventCallback('onBlur', [ event, this.proxy]);
  }

  check() {
    console.log("check called");
    this.isTouched = true;
    const isValid = this.props.required && !this.state.props.datavalue ? false : true;
    this.updateState({
      isValid: isValid
    } as WmTextState);
  }

  onFocus(event: any) {
    this.invokeEventCallback('onFocus', [ event, this.proxy]);
  }

  onKeyPress(event: any) {
    this.invokeEventCallback('onKeypress', [ event, this.proxy]);
  }

  renderWidget(props: WmTextProps) {
    return (
        <TextInput
          style={[this.styles.root, {borderBottomWidth: this.state.isValid === false ? 1 : 0, borderBottomColor: this.state.isValid === false ? 'red' : 'green'}]}
          keyboardType={this.state.keyboardType}
          defaultValue={this.state.props.datavalue}
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
