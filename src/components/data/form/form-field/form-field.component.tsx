import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { isEqual, find, get } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';
import {PERFORMANCE_LOGGER} from "@wavemaker/app-rn-runtime/core/logger";

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  isValid = true;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  public form: any;
  public formwidget: any;
  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormFieldProps(), new WmFormFieldState());
  }

  onFieldChangeEvt(name: string, $new: any, $old: any, isDefault: boolean) {
    this.validateFormField();
    if (!isEqual($old, $new)) {
      this.updateState({ props: { datavalue: $new }} as WmFormFieldState, () => {
        !isDefault && this.invokeEventCallback('onChange', [undefined, this, $new, $old]);
      });
      if (this.form) {
        this.form.updateDataOutput.call(this.form, get(this.props, 'formKey', this.props.name), $new);
      }
    }
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'datavalue':
        if (!isEqual($old, $new)) {
          PERFORMANCE_LOGGER.debug(`form field ${this.props.name} changed from ${$old} to ${$new}`);
        }
        break;
      case 'defaultvalue':
        if (!isEqual($old, $new)) {
          get(this, 'form') && this.form.applyDefaultValue(this);
        }
        break;
    }
  }

  validateFormField() {
    if (this.formwidget?.state.isValid === false) {
      this.updateState({isValid: false} as WmFormFieldState);
    } else {
      this.updateState({isValid: true} as WmFormFieldState);
    }
  }

  renderWidget(props: WmFormFieldProps) {
    var childrenWithProps = React.Children.map(props.renderFormFields(this.proxy).props.children, (child) => {
      return React.cloneElement(child, {
          datavalue: props.datavalue,
          isValid: this.state.isValid,
          invokeEvent: this.invokeEventCallback.bind(this),
          triggerValidation: this.validateFormField.bind(this),
          onFieldChange: this.onFieldChangeEvt.bind(this),
          formRef: props.formRef });
    });
    return (
      <View style={this.styles.root}>{childrenWithProps}
        {this.state.isValid === false && <Text style={this.styles.errorMsg}>{props.validationmessage}</Text>}
      </View>
    );
  }
}
