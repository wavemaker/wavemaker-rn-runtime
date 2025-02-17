import React from 'react';
import { DimensionValue, Text, TouchableOpacity, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import {unStringify, validateField} from '@wavemaker/app-rn-runtime/core/utils';

import WmCheckboxProps from './checkbox.props';
import { DEFAULT_CLASS, WmCheckboxStyles } from './checkbox.styles';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility';
import { createSkeleton } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import WmLabel from '../../basic/label/label.component';

export class WmCheckboxState extends BaseComponentState<WmCheckboxProps> {
  isChecked: boolean = false;
  isValid: boolean = true;
  errorType = '';
}

export default class WmCheckbox extends BaseComponent<WmCheckboxProps, WmCheckboxState, WmCheckboxStyles> {

  constructor(props: WmCheckboxProps) {
    super(props, DEFAULT_CLASS, new WmCheckboxProps(), new WmCheckboxState());
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
    const validationObj = validateField(this.state.props, value);
    this.updateState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as WmCheckboxState);
  }

  onPress() {
    if (this.state.props.disabled || this.state.props.readonly) {
      return;
    }
    this.invokeEventCallback('onFocus', [null, this.proxy]);
    this.invokeEventCallback('onTap', [null, this.proxy]);
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

  public renderSkeleton(props: WmCheckboxProps): React.ReactNode {
    return <View style={[this.styles.root, this.styles.skeleton.root]}>
        <WmIcon styles={{ root: {...this.styles.checkicon, ...this.styles.iconSkeleton.root} }}/>
        <WmLabel styles={{ root: {...this.styles.text, ...this.styles.labelSkeleton.root} }}/>
      </View>
  }

  renderWidget(props: WmCheckboxProps) {
    return (
      <TouchableOpacity 
        {...this.getTestPropsForAction()} 
        style={[this.styles.root, this.state.isChecked ? this.styles.checkedItem : null]} 
        onPress={this.onPress.bind(this)} 
        {...getAccessibilityProps(AccessibilityWidgetType.CHECKBOX, {hint: props?.hint, checked: this.state.isChecked})} 
        accessibilityRole='checkbox' 
        accessibilityLabel={`Checkbox for ${props.caption}`}
        onLayout={(event) => this.handleLayout(event)}
      >
          {this._background}
          <WmIcon iconclass="wi wi-check" styles={this.state.isChecked ? this.styles.checkicon : this.styles.uncheckicon} disabled={props.readonly || props.disabled} id={this.getTestId('checkbox')}/>
          <Text {...this.getTestPropsForLabel()} style={[this.styles.text, this.state.isChecked ? this.styles.selectedLabel: null]}>{props.caption}</Text>
      </TouchableOpacity>
    );
  }
}



