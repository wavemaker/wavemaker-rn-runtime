import { BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { forEach, isEmpty, some, get } from 'lodash';

import WmFormProps from '../form/form.props';
import WmForm from '@wavemaker/app-rn-runtime/components/data/form/form.component';

export class WmFormState extends BaseComponentState<WmFormProps> {
  isValid = false;
  type: 'success' | 'warning' | 'error' | 'info' | 'loading' | undefined = 'success';
  message: string = '';
  showInlineMsg: boolean = false;
}
const Live_Operations = {
  INSERT : 'insert',
  UPDATE : 'update',
  DELETE : 'delete',
  READ : 'read'
}

export default class WmLiveForm extends WmForm {

  findOperationType() {
    let operation;
    let isPrimary = false;
    // const sourceOperation = this.form.datasource && this.form.datasource.execute(DataSource.Operation.GET_OPERATION_TYPE);
    // if (sourceOperation && sourceOperation !== 'read') {
    //   return sourceOperation;
    // }
    /*If OperationType is not set then based on the formdata object return the operation type,
        this case occurs only if the form is outside a livegrid*/
    /*If the formdata object has primary key value then return update else insert*/
    if (this.primaryKey && !isEmpty(this.state.props.formdata)) {
      /*If only one column is primary key*/
      if (this.primaryKey.length === 1) {
        if (this.state.props.formdata[this.primaryKey[0]]) {
          operation = Live_Operations.UPDATE;
        }
        /*If only no column is primary key*/
      } else if (this.primaryKey.length === 0) {
          forEach(this.state.props.formdata, (value) => {
          if (value) {
            isPrimary = true;
          }
        });
        if (isPrimary) {
          operation = Live_Operations.UPDATE;
        }
        /*If multiple columns are primary key*/
      } else {
        // @ts-ignore
        isPrimary = some(this.primaryKey, (primaryKey: any) => {
          if (this.state.props.formdata[primaryKey]) {
            return true;
          }
        });
        if (isPrimary) {
          operation = Live_Operations.UPDATE;
        }
      }
    }
    return operation || Live_Operations.INSERT;
  }

  // @ts-ignore
  handleSubmit(event?: any) {
    event?.preventDefault();
    const formData = this.state.props.dataoutput || this.formdataoutput;
    const operationType = this.findOperationType();

    if (!this.validateFieldsOnSubmit()) {
      return false;
    }
    if (this.props.onBeforesubmit) {
      this.invokeEventCallback('onBeforesubmit', [ null, this.proxy, formData ]);
    }
    if (this.props.formSubmit) {
      this.props.formSubmit({inputFields: formData}, operationType, ((data: any) => {
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
      this.props.formSuccess && this.props.formSuccess();
      !this.props.onSuccess && this.state.props.postmessage && this.toggleMessage('success', this.state.props.postmessage);
    } else {
      this.invokeEventCallback('onError', [ null, this.proxy, response ]);
      !this.props.onError && this.toggleMessage('error', this.state.props.errormessage || get(response, 'message'));
    }
  }

}
