import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { isEqual, isNil, get, find, cloneDeep, forEach, keys } from 'lodash';

import WmFormFieldProps from './form-field.props';
import { DEFAULT_CLASS, WmFormFieldStyles } from './form-field.styles';
import {PERFORMANCE_LOGGER} from "@wavemaker/app-rn-runtime/core/logger";

export class WmFormFieldState extends BaseComponentState<WmFormFieldProps> {
  isValid = true;
}

export default class WmFormField extends BaseComponent<WmFormFieldProps, WmFormFieldState, WmFormFieldStyles> {
  public form: any;
  public formwidget: any;
  public _syncValidators: any;
  public defaultValidatorMessages: any = [];
  private notifyForFields: any = [];
  private _asyncValidatorFn: any;
  constructor(props: WmFormFieldProps) {
    super(props, DEFAULT_CLASS, new WmFormFieldProps(), new WmFormFieldState());
    if (!this.form) {
      this.form = props.formScope && props.formScope();
    }
  }

  componentDidMount() {
    super.componentDidMount();
    this.formwidget = (this.props.formKey && this.form?.formWidgets[this.props.formKey])
      || (this.props.name && this.form?.formWidgets[this.props.name]);
    this.form?.registerFormFields(this.form.formFields, this.form.formWidgets);
  }

  onFieldChangeEvt(name: string, $new: any, $old: any, isDefault: boolean) {
    this.notifyChanges();
    if (!isEqual($old, $new)) {
      this.updateState({ props: { datavalue: $new }} as WmFormFieldState, () => {
        !isDefault && this.invokeEventCallback('onChange', [undefined, this, $new, $old]);
        this.validateFormField();
      });
      if (this.form) {
        this.form.updateDataOutput.call(this.form, get(this.props, 'formKey', this.props.name), $new);
      }
    }
  }

  // Registers observer of validation fields
  observeOn(fields: any) {
    forEach(fields, (field) => {
      const formfield = find(this.form.formFields, (f) => f.proxy.name === field);
      if (formfield) {
        formfield.notifyForFields.push(this);
      }
    });
  }

  // Notifies changes to observing validation fields
  notifyChanges() {
    forEach(this.notifyForFields, (field) => {
      field.formwidget.validate(field.formwidget.datavalue);
      setTimeout(() => field.validateFormField());
    });
  }

  getPromiseList(validators: any) {
    const arr: any = [];
    forEach(validators, (fn) => {
      let promise = fn;
      if (fn instanceof Function && fn.bind) {
        promise = fn(this.formwidget.proxy, this.form);
      }
      if (promise instanceof Promise) {
        arr.push(promise);
      }
    });
    return arr;
  }

  // this method sets the asyncValidation on the form field. Assigns validationmessages from the returned response
  setAsyncValidators(validators: any) {
    this._asyncValidatorFn = () => {
        return Promise.all(this.getPromiseList(validators)).then(() => {
          return null;
        }, err => {
          let validationMsg: string;
          // if err obj has validationMessage key, then set validationMessage using this value
          // else return the value of the first key in the err object as validation message.
          if (err.hasOwnProperty('errorMessage')) {
            validationMsg = get(err, 'errorMessage');
          } else {
            const messageKeys = keys(err);
            validationMsg = (err[messageKeys[0]]).toString();
          }
          this.setInvalidState(validationMsg);
          return err;
        })
      };
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
        let propsObj: any = {
          props: {}
        };
        propsObj.props[key] = value;
        key === 'required' && this.updateState(propsObj as WmFormFieldState);
        this.formwidget.updateState(propsObj as WmFormFieldState);
      }
    });
  }

  updateFormWidgetDataset(res: any, displayField: string) {
    this.formwidget.updateState({
      props: {
        dataset: res.data,
        datafield: 'All Fields',
        displayfield: this.formwidget.state.props.displayfield || displayField,
      }
    } as WmFormFieldState);
  }

  setInvalidState(msg: string) {
    this.updateState({
      isValid: false,
      props: {
        validationmessage: msg
      }
    } as WmFormFieldState)
    this.formwidget.updateState({
      isValid: false,
      props: {
        validationmessage: msg
      }
    } as WmFormFieldState);
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
      case 'primary-key':
        if ($new) {
          this.form.setPrimaryKey(this.props.name);
        }
        break;
    }
  }

  setReadOnlyState(updateMode: any) {
    this.formwidget?.updateState({
      props: {
        readonly: !updateMode,
      }
    } as WmFormFieldState);
  }

  validateFormField() {
    if (this.formwidget?.state.isValid === false) {
      const errorType = this.formwidget?.state?.errorType;
      let validationMsg = get(this.defaultValidatorMessages, errorType);
      if (validationMsg) {
        if (validationMsg instanceof Function) {
          // passing formwidget and form as arguments to the errorMessage function.
          validationMsg = validationMsg(this.formwidget.proxy, this.form);
        }
        this.updateState({ props: {
            validationmessage: validationMsg
          }} as WmFormFieldState);
      }
      this.updateState({ isValid: false} as WmFormFieldState);
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
        this.setInvalidState(validationMsg);
      }
    })

    this._asyncValidatorFn && this._asyncValidatorFn();

  }

  get value(){
    return this.state.props.datavalue;
  }

  renderWidget(props: WmFormFieldProps) {
    var childrenWithProps = React.Children.map(props.renderFormFields(this.proxy).props.children, (child) => {
      return React.cloneElement(child, {
          datavalue: props.datavalue,
          value: this.value,
          isValid: this.state.isValid,
          maskchar: props.maskchar,
          displayformat: props.displayformat,
          classname : props.classname,
          invokeEvent: this.invokeEventCallback.bind(this),
          triggerValidation: this.validateFormField.bind(this),
          onFieldChange: this.onFieldChangeEvt.bind(this),
          formRef: props.formRef,
          ...(!isNil(props?.placeholder) ? { placeholder: props.placeholder } : {})
         });
    });
    return (
      <View style={this.styles.root}>{this._background}{childrenWithProps}
        {this.state.isValid === false && <Text {...this.getTestPropsForLabel('error_msg')} style={this.styles.errorMsg}>{props.validationmessage}</Text>}
      </View>
    );
  }
}
