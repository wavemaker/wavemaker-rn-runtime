import React from 'react';
import {Text, View} from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { isArray, forEach, isEqual, isObject, get, set } from 'lodash';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFormStyles } from './form.styles';
import WmLabel from "@wavemaker/app-rn-runtime/components/basic/label/label.component";
import WmIcon from "@wavemaker/app-rn-runtime/components/basic/icon/icon.component";
import { ToastConsumer, ToastService } from "@wavemaker/app-rn-runtime/core/toast.service";

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
}
export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  public formFields: any;
  private formdataoutput: any;
  private toaster: any;
  formWidgets: any;
  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFormProps());
  }

  componentDidMount() {
    super.componentDidMount();
  }

  registerFormFields(formFields: any, formWidgets: any) {
    forEach(formFields, w => {
      if (!w.form) {
        w.form = this;
      }
    });

    this.formFields = formFields;
    this.formWidgets = formWidgets;

    if (this.state.props.formdata) {
      this.applyFormData();
    }
  }

  applyFormData() {
    forEach(this.formWidgets, (fw) => {
      const propName = fw.props.name.replace('_formWidget', '');
      const key = get(this.formFields[propName], 'formKey') || propName;
      fw.updateState({
        props : {
          datavalue: get(this.state.props.formdata, key)
        }
      });
    });
  }

  formreset() {
    forEach(this.formFields, (fw) => {
      fw.updateState({
        props : {
          datavalue: ''
        }
      });
    });
    forEach(this.formWidgets, (fw) => {
      fw.updateState({
        props : {
          datavalue: ''
        }
      });
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
      this.formWidgets[key] && this.formWidgets[key].props.onValidate(this.formWidgets[key]);
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
            <View style={this.styles.heading}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <WmIcon styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
                <View>
                  <WmLabel styles={this.styles.title} caption={props.title}></WmLabel>
                  <WmLabel styles={this.styles.subheading} caption={props.subheading}></WmLabel>
                </View>
              </View>
            </View>
            {props.children}
          </View>
        }
        }
      </ToastConsumer>
    );
  }
}
