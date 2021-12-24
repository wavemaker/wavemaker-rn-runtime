import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import {isDefined, widgetsWithUndefinedValue} from '@wavemaker/app-rn-runtime/core/utils';
import { isArray, forEach, isEqual, isObject, get, set } from 'lodash';

import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmFormField, {WmFormFieldState} from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';
import { ToastConsumer, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
}
export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  public formFields: Array<BaseComponent<any, any, any>> = []; // contains array of direct widget elements [WmText, WmNumber, WmCurrent]
  private formdataoutput: any;
  private toaster: any;
  formWidgets: { [key: string]: WmFormField } = {}; // object containing key as name of formField and value as WmFormField proxy.
  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
  }

  componentDidMount() {
    super.componentDidMount();
  }

  registerFormFields(
    formFields: Array<BaseComponent<any, any, any>>,
    formWidgets: { [key: string]: WmFormField }
  ) {
    forEach(formWidgets, (w: WmFormField) => {
      if (!w.form) {
        w.form = this;
      }
    });

    this.formFields = formFields;
    this.formWidgets = formWidgets;

    if (this.state.props.formdata) {
      this.applyFormData();
    }
    this.applyDefaultValue();
  }

  applyFormData() {
    forEach(this.formWidgets, (fw: WmFormField, fwName: string) => {
      const key = get(get(this.formFields, fwName), 'formKey') || fwName;
      fw.updateState({
        props : {
          datavalue: get(this.state.props.formdata, key)
        }
      } as WmFormFieldState);
    });
  }

  updateFormFieldDefaultValue(formField: WmFormField) {
    if (formField) {
      const dv = formField.state.props.defaultvalue;
      if (isDefined(dv) && dv !== null) {
        const field = this.formFields.find((f) => {
          return f.props.name === formField.props.name;
        });
        if (field) {
          field.setState({ isDefault: true });
          field.updateState({
            props: {
              datavalue: dv
            }
          }, this.invokeEventCallback.bind(formField, 'onChange', [undefined, formField, dv]));
        }
      }
    }
  }

  applyDefaultValue(formField?: WmFormField) {
    if (formField) {
      this.updateFormFieldDefaultValue(formField);
      return;
    }
    forEach(this.formWidgets, (w: WmFormField) => {
      this.updateFormFieldDefaultValue(w);
    });
  }

  formreset() {
    forEach(this.formFields, (fw) => {
      fw.updateState({
        props : {
          datavalue: ''
        }
      }, () => {
        const widget = this.formWidgets[fw.props.name];
          widget.updateState({
              props : {
                datavalue: ''
              }
            } as WmFormFieldState);
        }
      );
    });
  }

  submit() {
    this.handleSubmit();
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'formdata':
        if ($new) {
          this.applyFormData();
        }
    }
  }

  // @ts-ignore
  handleSubmit(event?: any) {
    event?.preventDefault();
    const formData = this.state.props.dataoutput;
    let isValid = true;
    forEach(formData, (val, key) => {
      if(!val && this.formWidgets[key]?.props.required && widgetsWithUndefinedValue.indexOf(this.formWidgets[key]?.props.widget) < 0) {
        isValid = false;
      }
      const onValidate = get(this.formWidgets[key], 'props.onValidate');
      onValidate && onValidate(this.formWidgets[key]);
    });
    if(!isValid) {
      return false;
    }
    if(this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    if (this.props.formSubmit) {
      this.props.formSubmit(formData, ((data: any) => {
        this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
        this.onResultCb(data, 'success');
      }), ((error: any) => {
        this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
        this.onResultCb(error, '');
      }));
    } else {
      this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
    }
  }

  onResultCb(response: any, status: string, event?: any) {
    this.invokeEventCallback('onResult', [ null, this.proxy, response ]);
    if (status) {
      this.invokeEventCallback('onSuccess', [ null, this.proxy, response ]);
      this.toggleMessage('success', 'Data posted successfully');
    } else {
      this.invokeEventCallback('onError', [ null, this.proxy, response ]);
      this.toggleMessage('error', 'Failed to post data');
    }
  }

  updateDataOutput(key: string, val: any) {
    var current = this.formdataoutput || {};
    set(current, key, val);
    this.formdataoutput = current;
    this.updateState({ props: { dataoutput: current }} as WmFormState);
  }

  toggleMessage(type: string, message: string) {
    this.toaster.showToast({
      name: this, placement: "", styles: undefined,
      text: message,
      type: type,
      hideOnClick: true
    });
  }


  renderWidget(props: WmFormProps) {
    return (
      <ToastConsumer>
        {(toastService: ToastService) => {
          this.toaster = toastService;
          return <View style={this.styles.root}>
            {props.iconclass || props.title || props.subheading ? (
              <View style={this.styles.heading}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <WmIcon styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
                  <View>
                    <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
                    <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
                  </View>
                </View>
              </View>
            ) : null}
            {props.children}
          </View>
        }
        }
      </ToastConsumer>
    );
  }
}
