import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';

export class WmFormState extends BaseComponentState<WmFormProps> {}

export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {

  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
  }

  handleSubmit() {
console.log("stat", this.state);
  }

  handleChange() {

  }

  renderWidget(props: WmFormProps) {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <View style={this.styles.root}>{props.children}</View>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
