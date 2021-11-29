import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { isEqual } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';
import {PERFORMANCE_LOGGER} from "@wavemaker/app-rn-runtime/core/logger";

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  isValid = true;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  public form: any;
  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormFieldProps(), new WmFormFieldState());
  }

  onFieldChangeEvt(name: string, $new: any, $old: any) {
    if (!isEqual($old, $new)) {
      this.updateState({ props: { datavalue: $new } } as any);
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        if (!isEqual($old, $new)) {
          PERFORMANCE_LOGGER.debug(`form field ${this.props.name} changed from ${$old} to ${$new}`);
          this.invokeEventCallback('onChange', [undefined, this, $new, $old]);
        }
        break;
      case 'defaultvalue':
        this.updateState({props: { datavalue: $new } } as any);
        break;
    }
  }

  validateFormField() {
    if (this.state.props.required && !this.state.props.datavalue && widgetsWithUndefinedValue.indexOf(this.state.props.widget) < 0) {
      this.updateState({isValid: false} as WmFormFieldState);
    } else {
      this.updateState({isValid: true} as WmFormFieldState);
    }
  }

  renderWidget(props: WmFormFieldProps) {
    var childrenWithProps = React.Children.map(props.renderFormFields(this.proxy).props.children, (child) => {
      return React.cloneElement(child, {datavalue: props.datavalue, isValid: this.state.isValid, onFieldChange: this.onFieldChangeEvt.bind(this), formRef: props.formRef });
    });
    return (
      <View style={this.styles.root}>{childrenWithProps}
        {this.state.isValid === false && <Text style={{ color: 'red', fontSize: 11 }}>{props.validationmessage}</Text>}
      </View>
    );
  }
}
