import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { isDefined, widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { debounce, find, forEach, get, set } from 'lodash';

import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmFormField, { WmFormFieldState } from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import { ToastConsumer, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, WmFormStyles } from './form.styles';
import WmSkeleton from '../../basic/skeleton/skeleton.component';

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
  type: 'success' | 'warning' | 'error' | 'info' | 'loading' | undefined = 'success';
  message: string = '';
  showInlineMsg: boolean = false;
}
export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  public formFields: Array<WmFormField> = []; // contains array of direct widget elements [WmText, WmNumber, WmCurrent]
  public parentFormRef: any;
  public formfields: {[key: string]: WmFormField} = {};
  private formdataoutput: any;
  private toaster: any;
  formWidgets: { [key: string]: BaseComponent<any, any, any> } = {}; // object containing key as name of formField and value as WmFormField proxy.
  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, new WmFormProps());
  }

  private _debouncedSubmitForm = debounce(this.handleSubmit, 250);

  componentDidMount() {
    super.componentDidMount();
    this.getParentFormRef(this.props.parentForm);
  }

  getParentFormRef(pformName: string) {
    let current = this.parent;
    while (current) {
      if (get(current, 'props.name') === pformName) {
        this.parentFormRef = current;
        break;
      }
      current = current.parent;
    }
  }

  registerFormFields(
    formFields: Array<WmFormField>,
    formWidgets: { [key: string]: BaseComponent<any, any, any> }
  ) {
    forEach(formFields, (w: WmFormField) => {
      if (!w.form) {
        w.form = this;
        w.formwidget = w.props.name && formWidgets[w.props.name];
      }
    });

    this.formFields = formFields;
    this.formWidgets = formWidgets;

    formFields.forEach((f: WmFormField) => {
      if (f.props.name) {
        set(this.formfields, f.props.name, f);
      }
    })

    this.applyFormData();
    this.applyDefaultValue();

    // setting default form dataoutput.
    if (!this.formdataoutput) {
      this.formdataoutput = {};
      formFields.forEach((w: WmFormField) => {
        const name = get(w.props, 'formKey') || w.props.name;
        if (name) {
          set(this.formdataoutput, name, w.props.datavalue);
        }
      });
    }
  }

  applyFormData() {
    let formData = this.state.props.formdata || this.parentFormRef?.state.props.formdata;
    if (!formData || (this.parentFormRef && this.state.props.formdata)) {
      return;
    }
    forEach(this.formFields, (formField: WmFormField) => {
      let fw = formField.props?.name && this.formWidgets[formField.props.name];
      if (!fw) {
        fw = find(this.formWidgets, (fw: BaseComponent<any, any, any>) => {
          return get(fw, 'formfieldname') === formField.props.name
        });
      }
      let key = get(formField, 'formKey') || get(fw, 'props.name');
      fw && fw.setState({ isDefault: true });
      formField.updateState({
        props: {
          datavalue: get(formData, key)
        }
      } as WmFormFieldState);
    });
  }

  updateFormFieldDefaultValue(formField: WmFormField) {
    if (formField) {
      const dv = formField.state.props.defaultvalue;
      if (isDefined(dv) && dv !== null && this.formFields) {
        let field = formField.props?.name && this.formWidgets[formField.props.name];
        if (!field) {
          field = find(this.formWidgets, (fw: BaseComponent<any, any, any>) => {
            return get(fw, 'formfieldname') === formField.props.name
          });
        }
        if (field) {
          field.setState({ isDefault: true });
          field.updateState({
            props: {
              datavalue: dv
            }
          }, this.invokeEventCallback.bind(formField, 'onFieldChange', [undefined, formField, dv]));
        }
      }
    }
  }

  applyDefaultValue(formField?: WmFormField) {
    if (formField) {
      this.updateFormFieldDefaultValue(formField);
      return;
    }
    forEach(this.formFields, (w: WmFormField) => {
      this.updateFormFieldDefaultValue(w);
    });
  }

  formreset() {
    forEach(this.formFields, (ff: WmFormField) => {
      ff.updateState({
        props : {
          datavalue: ''
        }
      } as WmFormFieldState, () => {
          const id = ff.props.formKey || ff.props.name;
          if (id) {
            let widget: BaseComponent<any, any, any> | undefined | any = this.formWidgets[id];
            if (!widget) {
              widget = find(this.formWidgets, (fw: BaseComponent<any, any, any>) => {
                return get(fw, 'formfieldname') === ff.props.name
              });
            }
            widget.updateState({
              isValid: true,
              props : {
                datavalue: ''
              }
            }, () => ff.updateState({
              isValid: true
            } as WmFormFieldState));
            widget?.reset();
          }
        }
      );
    });
  }

  submit() {
    this._debouncedSubmitForm();
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'formdata':
        if ($new) {
          this.applyFormData();
        }
    }
  }
  // Disable the form submit if form is in invalid state. Highlight all the invalid fields if validation type is default
  validateFieldsOnSubmit() {
    let isValid = true;
    forEach(this.formFields, (field) => {
      const val = field?.state.props.datavalue;

      const onValidate = get(field, 'props.onValidate');
      onValidate && onValidate(field);
      if (!val && field?.state.props.required) {
        isValid = false;
        const msg = get(field.defaultValidatorMessages, 'required') || field.state.props.validationmessage;
        field.updateState({ isValid: isValid, props: {
            validationmessage: msg
          }} as WmFormFieldState);
        field.formwidget.validate && field.formwidget.validate(val);
      }
      // check for isvalid state of formwidget
      if (field.formwidget.state.isValid === false) {
        isValid = false;
      }
    });
    return isValid;
  }

  // @ts-ignore
  handleSubmit(event?: any) {
    event?.preventDefault();
    const formData = this.state.props.dataoutput || this.formdataoutput;

    if (!this.validateFieldsOnSubmit()) {
      return false;
    }
    if (this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    if (this.props.formSubmit) {
      this.props.formSubmit(formData, ((data: any) => {
        this.invokeEventCallback('onSubmit', [ null, this.proxy, formData ]);
        this.onResultCb(get(data, 'params'), 'success');
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
      !this.props.onSuccess && this.state.props.postmessage && this.toggleMessage('success', this.state.props.postmessage);
    } else {
      this.invokeEventCallback('onError', [ null, this.proxy, response ]);
      !this.props.onError && this.toggleMessage('error', this.state.props.errormessage || get(response, 'message'));
    }
  }

  updateDataOutput(key: string, val: any) {
    const current = this.formdataoutput || {};
    if (key) {
      set(current, key, val);
    } else {
      Object.assign(current, val)
    }
    this.formdataoutput = current;
    this.updateState({ props: { dataoutput: current }} as WmFormState);
    this.parentFormRef && this.parentFormRef.updateDataOutput(undefined, this.formdataoutput);
  }

  toggleMessage(
    type: 'success' | 'warning' | 'error' | 'info' | 'loading' | undefined,
    message: string
  ) {
    if (this.state.props.messagelayout === 'Inline') {
        this.setState({
          type: type,
          message: message,
          showInlineMsg: true
        } as WmFormState)
      return;
    }
    this.toaster.showToast({
      name: this, placement: "", styles: {bottom: 0},
      text: message,
      type: type,
      hideOnClick: true
    });
  }

  onMsgClose() {
    this.setState({
      showInlineMsg: false
    } as WmFormState)
  }

  public renderSkeleton(){
    return(
      <View style={this.styles.root}>
            {this.props.iconclass || this.props.title || this.props.subheading ? (
              <View style={this.styles.heading}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <WmIcon styles={this.styles.listIcon} iconclass={this.props.iconclass}></WmIcon>
                  <View>
                    <WmSkeleton width={this.styles.root?.width || 100} height={this.styles.root?.height || this.styles.title?.text.fontSize || 10 } styles={this.styles.title} />
                    <WmSkeleton width={150} height={this.styles.subheading?.text.fontSize || 10} styles={this.styles.subheading}/>
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.showInlineMsg ? <WmMessage type={this.state.type} caption={this.state.message} hideclose={false} onClose={this.onMsgClose.bind(this)}></WmMessage> : null
            }
            {this.props.children}
          </View>
    )
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
            {this.state.showInlineMsg ? <WmMessage type={this.state.type} caption={this.state.message} hideclose={false} onClose={this.onMsgClose.bind(this)}></WmMessage> : null
            }
            {props.children}
          </View>
        }
        }
      </ToastConsumer>
    );
  }
}
