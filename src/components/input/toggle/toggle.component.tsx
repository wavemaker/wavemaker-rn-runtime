import React from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {unStringify, validateField} from '@wavemaker/app-rn-runtime/core/utils';

import WmToggleProps from './toggle.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmToggleStyles } from './toggle.styles';

export class WmToggleState extends BaseComponentState<WmToggleProps> {
  isSwitchOn: boolean = false;
  isValid: boolean = true;
  errorType = '';
}

export default class WmToggle extends BaseComponent<WmToggleProps, WmToggleState, WmToggleStyles> {

  constructor(props: WmToggleProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmToggleProps(), new WmToggleState());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        let value =
          unStringify($new) ===
          unStringify(this.state.props.checkedvalue, true);
        this.updateState({ isSwitchOn: value } as WmToggleState);
        break;
    }
  }

  updateDatavalue(value: any) {
    this.updateState({ props: { datavalue: value }} as WmToggleState);
  }

  validate(value: any) {
    const validationObj = validateField(this.state.props, value);
    this.updateState({
      isValid: validationObj.isValid,
      errorType: validationObj.errorType
    } as WmToggleState);
  }

  onToggleSwitch(value: any) {
    const oldValue = this.state.props.datavalue;
    this.validate(value);
    this.updateState({ isSwitchOn: value } as WmToggleState);
    const dataValue = value === true ? this.state.props.checkedvalue : this.state.props.uncheckedvalue;
    // @ts-ignore
    this.updateState({ props: { datavalue: dataValue } },
      ()=> {
        if (!this.props.onFieldChange) {
          this.invokeEventCallback('onChange', [null, this.proxy, dataValue, oldValue]);
        } else {
          this.props.onFieldChange && this.props.onFieldChange('datavalue', dataValue, oldValue);
        }
        this.invokeEventCallback('onBlur', [ null, this.proxy ]);
      });
  }

  renderWidget(props: WmToggleProps) {
    return (
      <View style={this.styles.root}>
        <Switch value={this.state.isSwitchOn}
            color={this.styles.text.color as string}
            disabled={props.readonly || props.disabled}
            onValueChange={this.onToggleSwitch.bind(this)}
            onTouchEndCapture={() => {
              // Added setTimeout to smooth animation
              setTimeout(() => {
                if (!props.readonly) {
                  this.invokeEventCallback('onFocus', [null, this]);
                }
                this.invokeEventCallback('onTap', [null, this]);
              }, 500);
            }}/>
      </View>
    );
  }
}
