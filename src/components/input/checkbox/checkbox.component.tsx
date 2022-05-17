import React from 'react';
import { Text } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {unStringify, validateField} from '@wavemaker/app-rn-runtime/core/utils';

import WmCheckboxProps from './checkbox.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCheckboxStyles } from './checkbox.styles';

export class WmCheckboxState extends BaseComponentState<WmCheckboxProps> {
  isChecked: boolean = false;
  isValid: boolean = true;
}

export default class WmCheckbox extends BaseComponent<WmCheckboxProps, WmCheckboxState, WmCheckboxStyles> {

  constructor(props: WmCheckboxProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCheckboxProps(), new WmCheckboxState());
  }

  setChecked(dataValue: any, checkedvalue: any) {
    const value = unStringify(dataValue) === unStringify(checkedvalue, true);
    this.updateState({ isChecked: value } as WmCheckboxState);
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'checkedvalue':
        this.setChecked(this.state.props.datavalue, $new);
        break;
      case 'datavalue':
        this.setChecked($new, this.state.props.checkedvalue);
        break;
    }
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmCheckboxState);
  }
  validate(value: any) {
    const isValid = validateField(this.state.props, value);
    this.updateState({
      isValid: isValid
    } as WmCheckboxState);
  }

  onPress() {
    if (!this.state.props.readonly) {
      this.invokeEventCallback('onFocus', [null, this.proxy]);
    }
    this.invokeEventCallback('onTap', [null, this.proxy]);
    if (this.state.props.disabled) {
      return;
    }
    const oldValue = this.state.props.datavalue;
    const value = !this.state.isChecked;
    this.validate(value);
    this.updateState({ isChecked: value } as WmCheckboxState);
    const dataValue = value === true ? this.state.props.checkedvalue : this.state.props.uncheckedvalue;
    this.updateState({ props: { datavalue: dataValue } } as WmCheckboxState,
      () => {
        if (!this.props.onFieldChange) {
          this.invokeEventCallback('onChange', [null, this.proxy, dataValue, oldValue]);
        } else {
          this.props.onFieldChange && this.props.onFieldChange('datavalue', dataValue, oldValue);
        }
        this.invokeEventCallback('onBlur', [ null, this.proxy ]);
      });
  }

  renderWidget(props: WmCheckboxProps) {
    return (
      <TouchableOpacity style={this.styles.root} onPress={this.onPress.bind(this)}>
          <Checkbox.Android status={this.state.isChecked ? 'checked' : 'unchecked'} color={this.styles.text.color as string} disabled={props.readonly || props.disabled}/>
          <Text style={this.styles.checkboxLabel}>{props.caption}</Text>
      </TouchableOpacity>
    );
  }
}
