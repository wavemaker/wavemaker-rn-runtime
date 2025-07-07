import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { isDefined, widgetsWithUndefinedValue } from '@wavemaker/app-rn-runtime/core/utils';
import { debounce, find, forEach, isNil, get, set, cloneDeep, isEmpty } from 'lodash';

import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmFormField, { WmFormFieldState } from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import { ToastConsumer, ToastService } from '@wavemaker/app-rn-runtime/core/toast.service';

import WmFormProps from './form.props';
import { DEFAULT_CLASS, WmFormStyles } from './form.styles';
import { isDataSetWidget } from '@wavemaker/app-rn-runtime/core/utils';
import WmFormAction, {
  WmFormActionState
} from '@wavemaker/app-rn-runtime/components/data/form/form-action/form-action.component';

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
  type: 'success' | 'warning' | 'error' | 'info' | 'loading' | undefined = 'success';
  message: string = '';
  showInlineMsg: boolean = false;
  isUpdateMode: boolean = true;
  dynamicForm: any;
}
export default class WmForm extends BaseComponent<WmFormProps, WmFormState, WmFormStyles> {
  public formFields: Array<WmFormField> = []; // contains array of direct widget elements [WmText, WmNumber, WmCurrent]
  public parentFormRef: any;
  public formfields: {[key: string]: WmFormField} = {};
  public formdataoutput: any;
  private toaster: any;
  public formActions: Array<WmFormAction> = [];
  primaryKey = [];
  buttonArray: Array<WmFormAction> = [];
  formWidgets: { [key: string]: BaseComponent<any, any, any> } = {}; // object containing key as name of formField and value as WmFormField proxy.
  constructor(props: WmFormProps) {
    super(props, DEFAULT_CLASS, new WmFormProps(), new WmFormState());
  }

  private _debouncedSubmitForm = debounce(this.handleSubmit, 250);

  componentDidMount() {
    super.componentDidMount();
    this.getParentFormRef(this.props.parentForm);
  }

  getParentFormRef(pformName: string) {
    let current = this.parent;
    while (current) {
      if (pformName && (get(current, 'props.name') === pformName)) {
        this.parentFormRef = current;
        break;
      }
      current = current.parent;
    }
  }

  setReadonlyFields() {
    this.formFields?.forEach((field: any) => {
      field.setReadOnlyState(this.state.isUpdateMode);
    });
  }

  setReadonlyState(updateMode: any) {
    this.updateState({
      isUpdateMode: updateMode,
    } as WmFormState);
    setTimeout(() => {
      this.showActions();
      this.setReadonlyFields();
    }, 100);
  }

  edit() {
    this.setReadonlyState(true);
  }

  new() {
    this.setReadonlyState(true);
  }

  cancel() {
    this.setReadonlyState(false);
  }

  delete() { }

  registerFormFields(
    formFields: Array<WmFormField>,
    formWidgets: { [key: string]: BaseComponent<any, any, any> }
  ) {
    forEach(formFields, (w: WmFormField) => {
      if (!w.form) {
        w.form = this;
        w.formwidget = (w.props.formKey && formWidgets[w.props.formKey])
          || (w.props.name && formWidgets[w.props.name]);
      }
    });

    this.formFields = formFields;
    this.formWidgets = formWidgets;

    formFields?.forEach((f: WmFormField) => {
      if (f.props.name) {
        set(this.formfields, f.props.name, f);
      }
    })

    this.setReadonlyFields();

    this.applyFormData();
    this.applyDefaultValue();

    // setting default form dataoutput.
    if (!this.formdataoutput) {
      this.formdataoutput = {};
      formFields?.forEach((w: WmFormField) => {
        const name = get(w.props, 'formKey') || w.props.name;
        if (name) {
          set(this.formdataoutput, name, w.props.datavalue);
        }
      });
      this.updateState({
        props: {
          dataoutput: this.formdataoutput
        }
      } as WmFormState);
    }
  }

  showActions () {
    this.buttonArray?.forEach((action: any) => {
      action.updateState({
        props: {
          show: action.updateMode === this.state.isUpdateMode
        }} as WmFormActionState);
    });
  }

  registerFormActions(formActions: Array<WmFormAction>) {
    this.buttonArray = formActions;
    this.showActions();
  }

  private _updateFieldOnDataSourceChange(field: WmFormField, formFields: Array<WmFormField>) {
    if (!field.state.props.isDataSetBound && isDataSetWidget(field.props.widget)) {
      if (field.state.props.isRelated) {
        field.updateState({
          props: {
            isDataSetBound: true
          }} as WmFormFieldState);
        this.props.relatedData && this.props.relatedData(field);
      }
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
      if(Array.isArray(formData)){
        formData = formData[0];
      }
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

  get dataoutput() {
    return this.formdataoutput;
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
    this.formdataoutput = {};
    forEach(this.formFields, (ff: WmFormField) => {
      const defaultValue = isNil(ff.state.props.defaultvalue) ?  '' : ff.state.props.defaultvalue;
      ff.updateState({
        props : {
          datavalue: defaultValue
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
                datavalue: defaultValue
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

  // Function to generate and compile the form fields from the metadata
  generateFormFields() {
    let userFields;
    let fields = this.state.props.metadata ? this.state.props.metadata.data || this.state.props.metadata : [];

    if (isEmpty(fields)) {
      return;
    }

    if (this.props.onBeforerender) {
      userFields = this.invokeEventCallback('onBeforerender', [fields,  this.proxy]);
      if (userFields) {
        fields = userFields;
      }
    }

    this.updateState({
      dynamicForm:  this.props.generateComponent(fields, this.props.name, this.proxy, this.state.props.layoutposition === 'horizontal')
    } as WmFormState);

  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch (name) {
      case 'formdata':
        if ($new) {
          this.applyFormData();
        }
        break;
      case 'defaultmode':
        this.updateState({
          isUpdateMode: $new && $new === 'Edit' ? true : false,
        } as WmFormState);
        break;
      case 'dataset':
        this.formFields?.forEach((w: WmFormField) => {
          this._updateFieldOnDataSourceChange(w, this.formFields);
        });
        break;
      case 'metadata':
        this.generateFormFields();
        break;
    }
  }
  setPrimaryKey(fieldName: string) {
    /*Store the primary key of data*/
    this.primaryKey = this.primaryKey || [];
    // @ts-ignore
    if (this.primaryKey.indexOf(fieldName) === -1) {
      // @ts-ignore
      this.primaryKey.push(fieldName);
    }
  }
  // Disable the form submit if form is in invalid state. Highlight all the invalid fields if validation type is default
  validateFieldsOnSubmit() {
    let isValid = true;
    forEach(this.formFields, (field) => {
      const val = field?.state.props.datavalue;

      const onValidate = get(field, 'props.onValidate');
      onValidate && onValidate(field);
      if (!val && field?.state.props.required && ((field?.props.primaryKey && field?.props.generator === 'assigned') || !field?.props.primaryKey)) {
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
    const formData = cloneDeep(this.state.props.dataoutput || this.formdataoutput);

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
    this.parentFormRef && this.parentFormRef.updateDataOutput && this.parentFormRef.updateDataOutput(undefined, this.formdataoutput);
    this.updateState({
      props: {
        dataoutput: this.formdataoutput
      }
    } as WmFormState);
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
      hideOnClick: true,
      duration: 5000
    });
  }

  onMsgClose() {
    this.setState({
      showInlineMsg: false
    } as WmFormState)
  }

  renderWidget(props: WmFormProps) {
    return (
      <ToastConsumer>
        {(toastService: ToastService) => {
          this.toaster = toastService;
          return <View style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
            {this._background}
            {props.iconclass || props.title || props.subheading ? (
              <View style={this.styles.heading}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <WmIcon  id={this.getTestId('icon')} styles={this.styles.listIcon} iconclass={props.iconclass}></WmIcon>
                  <View>
                    <WmLabel id={this.getTestId('title')} styles={this.styles.title} caption={props.title} accessibilityrole='header'></WmLabel>
                    <WmLabel id={this.getTestId('description')} styles={this.styles.subheading} caption={props.subheading}></WmLabel>
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.showInlineMsg ? <WmMessage type={this.state.type} caption={this.state.message} hideclose={false} onClose={this.onMsgClose.bind(this)}></WmMessage> : null
            }
            { props.metadata && this.state.dynamicForm }
            { props.children}
          </View>
        }
        }
      </ToastConsumer>
    );
  }
}
