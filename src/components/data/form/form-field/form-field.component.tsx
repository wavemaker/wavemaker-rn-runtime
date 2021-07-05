import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { forEach } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  datavalue: any;
  isTouched = false;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormFieldProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        this.props.onFieldChange(undefined, undefined, $new);
        break;

    }
  }

  validateFormField() {
    console.log("validate me");
    forEach(this.props.children, (child) => {
      if (child.props.required) {
        child.props.checkFormField();
      }
    });
  }

  renderWidget(props: WmFormFieldProps) {
    var childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { isTouched: this.state.isTouched });
    });
    return (
      <View style={this.styles.root}>{childrenWithProps}</View>
    );
  }
}
