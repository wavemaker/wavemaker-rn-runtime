import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { isEqual, get, cloneDeep, forEach } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormFieldStyles } from './form-field.styles';
import {PERFORMANCE_LOGGER} from "@wavemaker/app-rn-runtime/core/logger";

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  isValid = true;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  public form: any;
  public formwidget: any;
  public _syncValidators: any;
  public defaultValidatorMessages: any = [];
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

  // sets the default validation on the form field
  setValidators(validators: any) {
    let _cloneValidators = cloneDeep(validators);
    this._syncValidators = [];
    forEach(_cloneValidators, (obj, index) => {
      // custom validation is bound to function.
      if (obj && obj instanceof Function) {
        // passing formwidget and form as arguments to the obj (i.e. validator function)
        _cloneValidators[index] = obj.bind(undefined, this.formwidget.proxy, this.form);
        this._syncValidators.push(_cloneValidators[index]);
      } else {
        // checks for default validator like required, maxchars etc.
        const key = get(obj, 'type');
        this.defaultValidatorMessages[key] = get(obj, 'errorMessage');
        const value = get(obj, 'validator');
        let validObj: any = {
          props: {}
        }
        validObj.props[key] = value;
        this.formwidget.updateState(validObj as WmFormFieldState);
      }
    });
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
      const errorType = this.formwidget?.state?.errorType;
      const msg = get(this.defaultValidatorMessages, errorType) || this.state.props.validationmessage;
      let validationMsg;
      if (msg && msg instanceof Function) {
        // passing formwidget and form as arguments to the errorMessage function.
        validationMsg = msg(this.formwidget.proxy, this.form);
      } else {
        validationMsg = msg;
      }
      this.updateState({ isValid: false, props: {
          validationmessage: validationMsg
        }} as WmFormFieldState);
    } else {
      this.updateState({ isValid: true } as WmFormFieldState);
    }

    this._syncValidators?.forEach((fn: any) => {
      const errormsg = fn();
      let validationMsg = errormsg?.errorMessage;
      if (validationMsg) {
        if (validationMsg instanceof Function) {
          // passing formwidget and form as arguments to the errorMessage function.
          validationMsg = validationMsg(this.formwidget.proxy, this.form);
        }
        this.updateState({
          isValid: false,
          props: {
            validationmessage: validationMsg
          }
        } as WmFormFieldState)
        this.formwidget.updateState({
          isValid: false,
          props: {
            validationmessage: validationMsg
          }
        } as WmFormFieldState);
      }
    })

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
