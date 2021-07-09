import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { forEach } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  datavalue: any;
  isValid = true;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormFieldProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        if ($old || $new) {
          this.props.onChange(undefined, this.proxy, $new);
        }
        break;
      case 'defaultvalue':
        this.updateState({ props: { datavalue: $new }} as WmFormFieldState);
        break;
    }
  }

  validateFormField() {
    console.log("validate me");
    if (this.state.props.required && !this.state.props.datavalue && widgetsWithUndefinedValue.indexOf(this.state.props.widget) < 0) {
      this.updateState({isValid: false} as WmFormFieldState);
    } else {
      this.updateState({isValid: true} as WmFormFieldState);
    }
  }

  renderWidget(props: WmFormFieldProps) {
    var childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { isValid: this.state.isValid, onFieldChange: this.onPropertyChange.bind(this) });
    });
    return (
      <View style={this.styles.root}>{childrenWithProps}
        {this.state.isValid === false && <Text style={{ color: 'red', fontSize: 11 }}>{props.validationmessage}</Text>}
      </View>
    );
  }
}
