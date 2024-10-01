import React, { Children, createRef } from 'react';
import { render, fireEvent, waitFor,screen } from '@testing-library/react-native';
import WmLiveForm from '@wavemaker/app-rn-runtime/components/data/liveform/liveform.component';
import WmFormAction from '@wavemaker/app-rn-runtime/components/data/form/form-action/form-action.component';
import WmFormBody from '@wavemaker/app-rn-runtime/components/data/form/form-body/form-body.component';
import WmFormFooter from '@wavemaker/app-rn-runtime/components/data/form/form-footer/form-footer.component';
import WmGridcolumn from '@wavemaker/app-rn-runtime/components/container/layoutgrid/gridcolumn/gridcolumn.component';
import WmGridrow from '@wavemaker/app-rn-runtime/components/container/layoutgrid/gridrow/gridrow.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmFormField from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';

const mockProps = {
  onBeforeservicecall: jest.fn(),
  formSubmit: jest.fn(),
  formSuccess: jest.fn(),
  onSuccess: jest.fn(),
  onError: jest.fn(),
  children: null
};

const mockFormField = ()=> <WmFormField
    name="firstname"
    displayname="Firstname"
    show={true}
    generator="assigned"
    type="string"
    readonly={false}
    required={false}
    widget="text"
    maxchars={255}
    inputtype="text"
    formRef="EmployeeLiveForm1"
    primaryKey={false}
    isRelated="undefined"              
    formKey="firstname"
    renderFormFields={()=><WmLabel caption='firstname'></WmLabel>}
  ></WmFormField>


const mockResetAction = (ref)=> <WmFormAction
    show={true}
    iconclass="wi wi-refresh"
    title="Reset"
    action={()=>ref.formreset()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_button_formAction"
    displayName="Reset"
    updateMode={true}
    btnClass="btn-default"
    classname="form-reset btn-default"
    formAction={()=>ref.formreset()}>
  </WmFormAction>

const mockSaveAction = (ref)=> <WmFormAction
    show={true}
    iconclass="wi wi-done"
    title="Save"
    action={()=>ref.submit()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_submit_formAction"
    displayName="Save"
    updateMode={true}
    btnClass="btn-primary"
    classname="form-save btn-success"
    formAction={()=>ref.submit()}
 ></WmFormAction>

const mockCancelAction = (ref)=><WmFormAction
    show={true}
    iconclass="wi wi-cancel"
    title="Cancel"
    action={()=>ref.cancel()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_button_formAction"
    displayName="Cancel"
    updateMode={true}
    btnClass="btn-default"
    classname="form-cancel btn-default"
    formAction={()=>ref.cancel()}
  ></WmFormAction>

const mockDeleteAction = (ref)=><WmFormAction
    show={true}
    iconclass="wi wi-trash"
    title="Delete"
    action={()=>ref.delete()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_button_formAction"
    displayName="Delete"
    updateMode={false}
    btnClass="btn-default"
    classname="form-delete btn-danger"
    formAction={()=>ref.delete()}>
  </WmFormAction>

const mockEditAction = (ref)=><WmFormAction
    show={true}
    iconclass="wi wi-pencil"
    title="Edit"
    action={()=>ref.edit()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_button_formAction"
    displayName="Edit"
    updateMode={false}
    btnClass="btn-default"
    classname="form-update btn-info"
    formAction={()=>ref.edit()}>
  </WmFormAction>

const mockNewAction = (ref)=><WmFormAction
    show={true}
    iconclass="wi wi-plus"
    title="New"
    action={()=>ref.new()}
    shortcutkey=""
    disabled={false}
    widget-type="button"
    formKey="EmployeeLiveForm1"
    name="EmployeeLiveForm1_button_formAction"
    displayName="New"
    updateMode={false}
    btnClass="btn-default"
    classname="form-new btn-success"
    formAction={()=>ref.new()}>
  </WmFormAction> 

const renderComponent = (props = {}, ref={}) => 
  render(
    <WmLiveForm
        errormessage=""
        title="Employee Info"
        iconclass="wi wi-edit"
        formlayout="inline"
        defaultmode="Edit"
        captionalign="left"
        captionposition="top"
        name="EmployeeLiveForm1"
        ref={ref}
        {...props}
      >
        <WmFormBody name="wm_form_body_e9ahh092j0">
            <WmGridrow name="gridrow2" >
              <WmGridcolumn
                columnwidth={12}
                name="gridcolumn2"
                xscolumnwidth={12}
                >
                {mockFormField()}
              </WmGridcolumn>
            </WmGridrow>
        </WmFormBody>
        <WmFormFooter name="wm_form_footer_i4ichf160a">
          {mockResetAction(ref)}
          {mockCancelAction(ref)}
          {mockSaveAction(ref)}
          {mockDeleteAction(ref)}
          {mockEditAction(ref)}
          {mockNewAction(ref)}
        </WmFormFooter>
      </WmLiveForm>
  )
  
describe('WmLiveFrom Component', ()=>{
  const Live_Operations = {
    INSERT : 'insert',
    UPDATE : 'update',
    DELETE : 'delete',
    READ : 'read'
  }
  const ref: any = createRef()

  test('check for render wmliveform correctly', ()=>{
    const comp = renderComponent({}, null)
    expect(comp).toBeDefined()
    expect(comp).not.toBeNull();
    expect(comp).toMatchSnapshot();
  })

  test('should return INSERT if no primary key is set', () => {
    renderComponent({...mockProps}, ref)
    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.INSERT);
    
  });

  test('should return UPDATE if there is a single primary key with value', () => {
    renderComponent(mockProps, ref)
    ref.current.primaryKey = ['id']
    ref.current.setState({
      props: {
        formdata: { id: 123 } 
      }
    });
    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.UPDATE);
  });

  test('should return INSERT if the primary key is set but form data has no primary key value', () => {
    renderComponent(mockProps, ref)
    ref.current.primaryKey = ['id']
    ref.current.setState({
      props: {
        formdata: { id: null } 
      }
    });

    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.INSERT);
  });

  test('should return UPDATE if there are multiple primary keys with at least one value', () => {
    renderComponent(mockProps, ref)
    ref.current.primaryKey =['id', 'otherId']
    ref.current.setState({
      props: {
        formdata: { id: 123, otherId: null}
      }
    });

    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.UPDATE);
  });

  test('should return UPDATE if the primary key array is empty but form data has some value', () => {
    renderComponent(mockProps,ref)
    ref.current.primaryKey = [];
    ref.current.setState({
      props: {
        formdata: { name: 'user1' }
      }
    });

    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.UPDATE);
  });

  test('should return INSERT if primary key is empty and form data is also empty', () => {
    renderComponent(mockProps, ref)
    ref.current.primaryKey = [];
    ref.current.setState({
      props: {
        formdata: {}
      }
    });

    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.INSERT);
  });

  test('should return UPDATE if multiple primary keys with values in form data', () => {
    renderComponent(mockProps, ref)
    ref.current.primaryKey = ['id', 'otherId'];
    ref.current.setState({
      props: {
        formdata: { id: 1, secondaryId: 2 }
      }
    });

    const result = ref.current.findOperationType();
    expect(result).toBe(Live_Operations.UPDATE);
  });


  test('check for handleSubmit with form err validations', async() => {
    const findOperationTypeMock = jest.spyOn(WmLiveForm.prototype, 'findOperationType').mockReturnValue('insert');
    const validateFieldsMock = jest.spyOn(WmLiveForm.prototype, 'validateFieldsOnSubmit').mockReturnValue(false);
    const eventMock = { preventDefault: jest.fn() };

    renderComponent(mockProps, ref)

    ref.current.handleSubmit(eventMock)

    expect(findOperationTypeMock).toHaveBeenCalled();
    expect(validateFieldsMock).toHaveBeenCalled();
    expect(ref.current.handleSubmit(eventMock)).toBe(false)
  })

  test('check for handleSubmit with no form validation', async() => {
    const findOperationTypeMock = jest.spyOn(WmLiveForm.prototype, 'findOperationType').mockReturnValue('insert');
    const validateFieldsMock = jest.spyOn(WmLiveForm.prototype, 'validateFieldsOnSubmit').mockReturnValue(true);
    const eventMock = { preventDefault: jest.fn() };
    const formSubmitMock = jest.fn();
    const onBeforeServiceCallMock = jest.fn();

    const props = {
      formSubmit: formSubmitMock,
      onBeforeservicecall: onBeforeServiceCallMock,
    };

    const tree = renderComponent({...mockProps, ...props}, ref)
    expect(tree).toMatchSnapshot()

    ref.current.handleSubmit(eventMock)

    expect(findOperationTypeMock).toHaveBeenCalled();
    expect(validateFieldsMock).toHaveBeenCalled();
    expect(onBeforeServiceCallMock).toHaveBeenCalled();
    expect(formSubmitMock).toHaveBeenCalled();

  })

  test('should call formSubmit with correct arguments and handle success and error callbacks', () => {
    const eventMock = { preventDefault: jest.fn() };
    const formSubmitMock = jest.fn((input, operationType, onSuccess, onError) => {
      onSuccess({ data: 'mock success data' });
      onError({ error: 'mock error data' });
    });
  
    const onBeforeServiceCallMock = jest.fn();
    const onResultCbMock = jest.spyOn(WmLiveForm.prototype, 'onResultCb');
    const invokeEventCallbackMock = jest.fn();
    const toggleMessageMock = jest.fn();

    const operationTypeMock = 'insert';
    const props = {
      formSubmit: formSubmitMock,
      onBeforeservicecall: onBeforeServiceCallMock,
    };
  
    renderComponent({...mockProps, ...props}, ref)
    expect(ref.current).not.toBeNull()

    ref.current.formdataoutput = { field1: 'value1', field2: 'value2' };
    ref.current.handleSubmit(eventMock);
  
    expect(eventMock.preventDefault).toHaveBeenCalled();
    // Check if formSubmit is called with correct arguments
    expect(formSubmitMock).toHaveBeenCalledWith(
      { inputFields: ref.current.formdataoutput },
      'insert',
      expect.any(Function), 
      expect.any(Function)  
    );
  
    // Check if success callback was called correctly
    expect(onResultCbMock).toHaveBeenCalledWith({ data: 'mock success data' }, 'success', operationTypeMock);
  
    // Check if error callback was called correctly
    expect(onResultCbMock).toHaveBeenCalledWith({ error: 'mock error data' }, '', operationTypeMock);
  
    // Cleanup mocks after test
    onResultCbMock.mockRestore();

    const toggleMessageMockProps = {
      formSuccess: jest.fn(), 
      onSuccess: null, 
      onError: null
    };

    renderComponent({...mockProps, ...toggleMessageMockProps}, ref)

    ref.current.invokeEventCallback = invokeEventCallbackMock;
    ref.current.toggleMessage = toggleMessageMock;

    const success_response = { data: 'mock success data' };
    const err_response = 'An error occured. Please try again!';

    const success_status = 'success';
    const err_status = '';
    const operationType = 'insert';

    ref.current.onResultCb(success_response, success_status, operationType);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onSuccess', [null, operationType, success_response]);
    expect(toggleMessageMock).toHaveBeenCalledWith('success', 'Data posted successfully');

    ref.current.onResultCb(err_response, err_status, operationType);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onError', [null, operationType, err_response]);
    expect(toggleMessageMock).toHaveBeenCalledWith('error', 'An error occured. Please try again!');

  });
  
});

