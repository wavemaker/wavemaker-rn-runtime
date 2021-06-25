import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {

  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormFieldProps());
  }

  renderWidget(props: WmFormFieldProps) {
    console.info("props", props.children);
    return (
      <View style={this.styles.root}>{props.children}</View>
    );
  }
}
