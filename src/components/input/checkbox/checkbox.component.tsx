import React from 'react';
import { Text } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCheckboxProps from './checkbox.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCheckboxStyles } from './checkbox.styles';
import { Checkbox } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

export class WmCheckboxState extends BaseComponentState<WmCheckboxProps> {
  isChecked: boolean = false;
}

export default class WmCheckbox extends BaseComponent<WmCheckboxProps, WmCheckboxState, WmCheckboxStyles> {

  constructor(props: WmCheckboxProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCheckboxProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        let value = false;
        if ($new === this.state.props.checkedvalue) {
          value = true;
        }
        this.updateState({ isChecked: value } as WmCheckboxState);
        this.props.onFieldChange && this.props.onFieldChange('datavalue', $new, $old);
        break;
    }
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmCheckboxState);
  }

  onPress() {
    if (!this.state.props.readonly) {
      this.invokeEventCallback('onFocus', [null, this.proxy]);
    }
    this.invokeEventCallback('onTap', [null, this.proxy]);
    const oldValue = this.state.props.datavalue;
    const value = !this.state.isChecked;
    this.updateState({ isChecked: value } as WmCheckboxState);
    const dataValue = value === true ? this.state.props.checkedvalue : this.state.props.uncheckedvalue;
    this.updateState({ props: { datavalue: dataValue } } as WmCheckboxState,
      () => {
        this.invokeEventCallback('onChange', [ null, this.proxy, dataValue, oldValue ]);
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
