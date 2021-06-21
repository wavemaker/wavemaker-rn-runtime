import React from 'react';
import { Switch } from 'react-native-paper';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmToggleProps from './toggle.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmToggleStyles } from './toggle.styles';
import {TouchableOpacity} from "react-native-gesture-handler";
import {View} from "react-native";

export class WmToggleState extends BaseComponentState<WmToggleProps> {
  isSwitchOn: boolean = false;
}

export default class WmToggle extends BaseComponent<WmToggleProps, WmToggleState, WmToggleStyles> {

  constructor(props: WmToggleProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmToggleProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        let value = false;
        if ($new === this.props.checkedvalue) {
          value = true;
        }
        this.updateState({isSwitchOn: value} as WmToggleState);
        break;
    }
  }

  onToggleSwitch(value: any) {
    console.log("val", value);
    const oldValue = this.state.props.datavalue;
    this.updateState({isSwitchOn: value} as WmToggleState);
    const dataValue = value === true ? this.state.props.checkedvalue : this.state.props.uncheckedvalue;
    // @ts-ignore
    this.updateState({props: {datavalue: dataValue}},
      ()=> {
        this.invokeEventCallback('onChange', [ null, this.proxy, dataValue, oldValue ]);
        this.invokeEventCallback('onBlur', [ null, this.proxy ]);
      });
  }

  renderWidget(props: WmToggleProps) {
    return (
      <View>
        <TouchableOpacity style={this.styles.root} onPress={() => {
          if (!props.readonly) {
            this.invokeEventCallback('onFocus', [null, this]);
          }
          this.invokeEventCallback('onTap', [null, this]);
        }}>
          <Switch value={this.state.isSwitchOn}
                  color={this.styles.text.color}
                  onValueChange={this.onToggleSwitch.bind(this)} />
        </TouchableOpacity>
      </View>
    );
  }
}
