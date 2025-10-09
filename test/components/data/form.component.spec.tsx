import React from 'react';
import { View } from 'react-native'
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WmForm from '@wavemaker/app-rn-runtime/components/data/form/form.component';
import WMCard from '@wavemaker/app-rn-runtime/components/data/card/card.component';
import { ToastConsumer, ToastService, ToastProvider } from '@wavemaker/app-rn-runtime/core/toast.service';


jest.mock('@wavemaker/app-rn-runtime/core/utils', () => {
  return {
    ...jest.requireActual('@wavemaker/app-rn-runtime/core/utils'),
    isDataSetWidget: jest.fn(() => {
      return true;
    }),
  }
})

const mockShowToast = jest.fn();
const mockToaster = {
  showToast: mockShowToast
}

class SampleToastProvider extends React.Component<React.ComponentProps<any>> {
  constructor(props) {
    super(props);
  }
  render(): React.ReactNode {
    return <ToastProvider value={{...mockToaster}}>
       {this.props.children}
    </ToastProvider>
  }
}

describe('WmForm', () => {

  const defaultProps = {
    title: 'Form Title',
    subheading: 'Form Subheading',
    iconclass: 'wm-icon-class'
  };

  it('renders WmForm component', () => {
    const { getByText } = render(<SampleToastProvider>
      <WmForm {...defaultProps} />
      </SampleToastProvider>);
    expect(getByText('Form Title')).toBeTruthy();
    expect(getByText('Form Subheading')).toBeTruthy();
  });

  it('componentDidMount sets parent form reference', () => {
    const tree = render(
      <WmForm name="parentForm">
        <WMCard>
          <WmForm {...defaultProps} parentForm="parentForm" />
        </WMCard>
      </WmForm>
    );

    const allForms = tree.UNSAFE_getAllByType(WmForm)
    const childForm = allForms[1];

    expect(childForm.instance.parentFormRef).not.toBeNull()
  });

  it('should have width and height to be 0 when show is false', () => {
    const props = {
      ...defaultProps,
      title: 'some_title_new',
      iconclass: 'some-icon-class',
      show: false,
    }
    const tree = render(<WmForm {...props} name="form"/>)
    const viewEle = tree.UNSAFE_getAllByType(View)[0].instance
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  })

  it('onPropertyChange applyFormData gets called when the prop is changed', () => {
    // Arrange
    const tree = render(<WmForm {...defaultProps}/>)
    const instance = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    const mockApplyFormData = jest.fn();
    instance.applyFormData = mockApplyFormData;

    // Act
    instance.onPropertyChange('formdata', 'some new value', 'some old value');

    // Assert
    expect(mockApplyFormData).toHaveBeenCalled()
  })

  it('onPropertyChange should change the updated mode with respect to the passed defaultmode', () => {
    // Arrange
    const props = {
      ...defaultProps,
      defaultmode: 'Edit'
    }
    const tree = render(<WmForm {...props}/>)
    const instance = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    const mockUpdateState = jest.fn()
    instance.updateState = mockUpdateState;

    // Act
    instance.onPropertyChange('defaultmode', 'Edit', 'some old value');

    // Assert
    expect(mockUpdateState).toHaveBeenCalledWith({"isUpdateMode": true})

    // Act
    instance.onPropertyChange('defaultmode', 'Non Edit', 'some old value');

    // Assert
    expect(mockUpdateState).toHaveBeenCalledWith({"isUpdateMode": false})
  })


  it('onPropertyChange should update all the form fields when dataset is changed', () => {
    // Arrange
    const props = {
      ...defaultProps,
      defaultmode: 'Edit'
    }
    const tree = render(<WmForm {...props}/>)
    const instance = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    const mockFormFields = ['form field 1', 'form field 2', 'form field 3', 'form field 4'];
    instance.formFields = mockFormFields;
    const mockUpdateFieldOnDataSourceChange = jest.fn()
    instance._updateFieldOnDataSourceChange = mockUpdateFieldOnDataSourceChange;
    // Act
    instance.onPropertyChange('dataset', 'some new dataset', 'some old dataset');

    // Assert
    expect(mockUpdateFieldOnDataSourceChange).toHaveBeenCalledTimes(mockFormFields.length);
  })

  it('onPropertyChange generates form fields when metadata is updated', () => {
    // Arrange
    const props = {
      ...defaultProps,
      defaultmode: 'Edit'
    }
    const tree = render(<WmForm {...props}/>)
    const instance = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    const mockGenerateFormFields = jest.fn()
    instance.generateFormFields = mockGenerateFormFields;
    // Act
    instance.onPropertyChange('metadata', 'some new dataset', 'some old dataset');

    // Assert
    expect(mockGenerateFormFields).toHaveBeenCalled()
  })


  it('setReadonlyFields calls setReadOnlyState', () => {
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;
    instance.state.isUpdateMode = "mock updated mode"
    const mockSetReadOnlyStateFunc = jest.fn()
    const mockFormFields = [
      {
        setReadOnlyState: mockSetReadOnlyStateFunc
      },
      {
        setReadOnlyState: mockSetReadOnlyStateFunc
      }
    ]
    instance.formFields = mockFormFields;
    instance.setReadonlyFields()
    expect(mockSetReadOnlyStateFunc).toHaveBeenCalledTimes(2)
    expect(mockSetReadOnlyStateFunc).toHaveBeenCalledWith('mock updated mode')
  }) 

  it('setReadonlyState updates readonly state correctly',  () => {
    jest.useFakeTimers();
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;
    instance.showActions = jest.fn();
    instance.setReadonlyFields = jest.fn()

    const mockUpdateMode = 'sample updateMode';
    instance.setReadonlyState(mockUpdateMode)

    jest.advanceTimersByTime(100)


    expect(instance.showActions).toHaveBeenCalled()
    expect(instance.setReadonlyFields).toHaveBeenCalled()

  })
  
  it('form actions - edit, new, cancel', () => {
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;

    const mockSetReadOnlyState = jest.fn()
    instance.setReadonlyState = mockSetReadOnlyState;
    instance.edit();
    instance.new();
    instance.cancel();
    expect(mockSetReadOnlyState).toHaveBeenCalledTimes(3)

  })
  
  it('registerFormFields registers form fields and sets readonly fields', () => {
    const {  UNSAFE_getByType } = render(<WmForm {...defaultProps} parentForm="parentForm" />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const formFields = [{ props: { name: 'testField' }, setReadOnlyState: jest.fn(), updateState: jest.fn() }];
    const formWidgets = {};

    const mockSetReadonlyFields = jest.fn()

    const mockSetApplyFormData = jest.fn()
    const mockApplyDefaultValue = jest.fn();

    instance.setReadonlyFields = mockSetReadonlyFields;
    instance.applyFormData = mockSetApplyFormData;
    instance.applyDefaultValue = mockApplyDefaultValue;

    instance.registerFormFields(formFields, formWidgets);
    expect(instance.formFields).toEqual(formFields);
    expect(instance.formWidgets).toEqual(formWidgets);
    expect(instance.formfields.testField).toEqual(formFields[0]);
    expect(instance.setReadonlyFields).toHaveBeenCalled();
  });

  it('showActions updates all action button states', () => {
    const mockButtonUpdateStates = jest.fn();
    const mockButtonsArray = [{
      updateState: mockButtonUpdateStates,
      updateMode: 'some updaye mode'
    }]
    const tree = render(<WmForm {...defaultProps}/>)
    const instance = tree.UNSAFE_getByType(WmForm).instance;
    instance.buttonArray = mockButtonsArray;
    instance.showActions()
    expect(mockButtonUpdateStates).toHaveBeenCalledWith({
      props: {
        "show": false
      }
    })
  })

  it('registerFormActions adds form actions', () => {
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;
    const mockActions = [{}, {}, {}]
    const mockShowActions = jest.fn();
    instance.showActions = mockShowActions;

    instance.registerFormActions(mockActions)

    expect(instance.buttonArray).toEqual(mockActions)
    expect(mockShowActions).toHaveBeenCalled()
  })

  it('revert later', async () => {
    const mockRelatedData = jest.fn()
    const props = {
      relatedData: mockRelatedData
    }
    const tree = render(<WmForm {...props}/>);
    const instance = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    const mockFieldProps = {
      'isDataSetBound': false,
      widget: 'some widget',
      isRelated: true
    }
    const mockFormFields = [{
      state: {
        props: mockFieldProps
      },
      props: mockFieldProps,
      updateState: jest.fn()
    }]
    instance.formFields = mockFormFields
    instance.onPropertyChange('dataset', 'some new value', 'some old value')
    
    await waitFor(() => {
      expect(mockRelatedData).toHaveBeenCalled()
    })
  })

  it('applyFormData doesnt update formdata of formfields when props form data not exists', () => {
    const mockFormFieldUpdateState = jest.fn();
    const formFields = [
      {
        updateState: mockFormFieldUpdateState
      }
    ]
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    instance.state.props.formdata = null;
    instance.parentFormRef = null;

    instance.formFields = formFields;
    instance.applyFormData()

    expect(mockFormFieldUpdateState).not.toHaveBeenCalled()

  })

  it('applyFormData updates formdata of formfields when props form data exists', async () => {
    const mockFormFieldUpdateState = jest.fn();
    const formFields = [
      {
        'formKey': 'key', 
        updateState: mockFormFieldUpdateState
      }
    ]
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    instance.state.props = {
      "formdata": {
        "key": "some form field data"
      }
    }
    instance.parentFormRef = null;
    instance.formFields = formFields;
    instance.applyFormData()

    expect(mockFormFieldUpdateState).toHaveBeenCalledWith({"props": {"datavalue": 'some form field data'}})
  })

  it('applyFormData updates formdata of formfields when prop formdata exists and formdata is an array', () => {
    const mockFormFieldUpdateState = jest.fn();
    const formFields = [
      {
        'formKey': 'key', 
        updateState: mockFormFieldUpdateState
      }
    ]
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    const mockFormData = [{
      "key": "some form field data"
    }]
    instance.state.props = {
      "formdata": mockFormData
    }
    instance.parentFormRef = null;
    instance.formFields = formFields;
    instance.applyFormData()

    expect(mockFormFieldUpdateState).toHaveBeenCalledWith({"props": { "datavalue": mockFormData[0]['key']}})

  })

  it('applyDefaultValue updates formfield default value if formfield passed', () => {
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    const mockUpdateFormFieldDefaultValue = jest.fn();
    instance.updateFormFieldDefaultValue = mockUpdateFormFieldDefaultValue;
    instance.applyDefaultValue('some form field');
    expect(mockUpdateFormFieldDefaultValue).toHaveBeenCalledWith('some form field')
  })

  it('applyDefaultValue updates existing form fields default value if formfield not passed', () => {
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    instance.formFields = [
      {}, {}, {}
    ]
    const mockUpdateFormFieldDefaultValue = jest.fn();
    instance.updateFormFieldDefaultValue = mockUpdateFormFieldDefaultValue;
    instance.applyDefaultValue(null);
    expect(mockUpdateFormFieldDefaultValue).toHaveBeenCalledTimes(instance.formFields.length)
  })

  it('formreset resets all default values of existing form fields', () => {
    const mockFFUpdateState = jest.fn((paramOne, paramTwo) => paramTwo());
    const formFields = [
      {
         state: { props: {} },
        updateState: mockFFUpdateState,
        props: {formKey: 'keyOne'} 
      }, {
        state: { props: {} },
        updateState: mockFFUpdateState,
        formKey: 'keyTwo',
        props: {formKey: 'keyTwo'} 
      }, {
        state: { props: {} },
        updateState: mockFFUpdateState,
        formKey: 'keyThree',
        props: {formKey: 'keyThree'} 
      }
    ]

    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    instance.formFields = formFields;
    const mockReset = jest.fn()
    instance.formWidgets = [{
      reset: mockReset,
      updateState: jest.fn()
    }, {
      reset: mockReset,
      updateState: jest.fn()
    }, {
      reset: mockReset,
      updateState: jest.fn()
    }]
    instance.formreset()
    expect(mockFFUpdateState).toHaveBeenCalledTimes(formFields.length)
    expect(mockReset).toHaveBeenCalled()
  })

  it('submit should call _debouncedSubmitForm when it is executed', () => {
    //_debouncedSubmitForm
    const instance = render(<WmForm {...defaultProps}/>).UNSAFE_getByType(WmForm).instance;
    const mockDebouncedSubmitForm = jest.fn()
    instance._debouncedSubmitForm = mockDebouncedSubmitForm
    instance.submit()
    expect(mockDebouncedSubmitForm).toHaveBeenCalled()
  })

  it('form submit should not invoke any callback when validation fails ', () => {
    
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => false);
    instance.invokeEventCallback = jest.fn(() => true);
    instance.handleSubmit();
    
    expect(instance.invokeEventCallback).not.toHaveBeenCalled()
  });

  it('form submit should invoke onBeforesubmit callback if it is provided', () => {
    
    const onBeforesubmitMock = jest.fn()
    const props = {
      ...defaultProps,
      onBeforesubmit: onBeforesubmitMock
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.handleSubmit();
    
    expect(onBeforesubmitMock).toHaveBeenCalled()
  });


  it('form submit should invoke formSubmit from props and resultCB if it is provided and formSubmit is succeeded', () => {
    
    const mockFormSubmit = jest.fn((data, cb, failure) => cb(data));
    const props = {
      ...defaultProps,
      formSubmit: mockFormSubmit
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.onResultCb = jest.fn()
    instance.handleSubmit();
    
    expect(mockFormSubmit).toHaveBeenCalled();
    expect(instance.onResultCb).toHaveBeenCalled();
  });

  it('form submit should invoke formSubmit from props and resultCB with error if it is provided and formSubmit is failed', () => {
    
    const mockFormSubmit = jest.fn((data, cb, failure) => failure('some error'));
    const props = {
      ...defaultProps,
      formSubmit: mockFormSubmit
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.onResultCb = jest.fn()
    instance.handleSubmit();
    
    expect(instance.props.formSubmit).toHaveBeenCalled();
    expect(mockFormSubmit).toHaveBeenCalled();
    expect(instance.onResultCb).toHaveBeenCalledWith('some error', '');
  });

  it('form submit should invoke onsubmit callback when onSubmit is not provided as prop', () => {
    
    const mockSubmit = jest.fn()
    const props = {
      ...defaultProps,
      onSubmit: mockSubmit
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.handleSubmit();
    
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('onMsgClose updates showInlinesMessage', async () => {
    const { instance } = render(<WmForm {...defaultProps}/>).UNSAFE_getAllByProps(WmForm)[0]

    instance.onMsgClose();

    await waitFor(() => {
      expect(instance.state.showInlineMsg).toBeFalsy()
    })
  })

  it('clearMessage updates showInlineMsg', async () => {
    const { instance } = render(<WmForm {...defaultProps}/>).UNSAFE_getAllByProps(WmForm)[0]

    instance.clearMessage();

    await waitFor(() => {
      expect(instance.state.showInlineMsg).toBeFalsy()
    })
  })

  it('toggleMessage updates the type and message when messagelayout is Inline', async () => {
    const props = {
      ...defaultProps,
      messagelayout: 'Inline'
    }
    const mockType = 'some type';
    const mockMessage = 'some message';

    const { instance } = render(<WmForm {...props}/>).UNSAFE_getAllByType(WmForm)[0]

    instance.toggleMessage(mockType, mockMessage)

    await waitFor(() => {
      expect(instance.state.type).toEqual(mockType)
      expect(instance.state.message).toEqual(mockMessage)
      expect(instance.state.showInlineMsg).toBeTruthy()
    })
  })

  it('toggleMessage calls showToast when messagelayout is non Inline', () => {
    const props = {
      ...defaultProps,
      messagelayout: 'non-Inline'
    }
    const mockType = 'some type';
    const mockMessage = 'some message';

    const { instance } = render(<WmForm {...props}/>).UNSAFE_getAllByType(WmForm)[0]

    instance.toaster = {
      showToast: jest.fn(() => {})
    }
    instance.toggleMessage(mockType, mockMessage)
    expect(instance.toaster.showToast).toHaveBeenCalled()
  })

  it('updateDataOutput updateState with formdata output with valid key provided', async () => {
    const tree = render(<WmForm name='parent'>
      <WmForm {...defaultProps} parentForm="parent"/>
    </WmForm>)
    const instance = tree.UNSAFE_getAllByType(WmForm)[1].instance;
    //instance.formdataoutput = {};

    const instanceParent = tree.UNSAFE_getAllByType(WmForm)[0].instance;
    instanceParent.updateDataOutput = jest.fn();

    const key = "somekey"
    const value = "somevalue"

    instance.updateDataOutput(key, value);

    await waitFor(() => {
      expect(instance.formdataoutput).toEqual({
        "somekey": "somevalue",
      })
      expect(instanceParent.updateDataOutput).toHaveBeenCalled()
    })
  })
  it('onResultCb should invoke callback with respective params', () => {
    const { instance } = render(<WmForm {...defaultProps}/>).UNSAFE_getAllByType(WmForm)[0]
    const mockInvokeEventCallback = jest.fn();
    const mockToggleMessage = jest.fn()

    instance.invokeEventCallback = mockInvokeEventCallback;
    instance.toggleMessage = mockToggleMessage;

    let mockResponse = {"key": "value"};
    let mockStatus = true;

    instance.onResultCb(mockResponse, mockStatus)

    expect(mockInvokeEventCallback).toHaveBeenCalled()
    expect(mockToggleMessage).toHaveBeenCalledWith("success", "Data posted successfully")
    mockInvokeEventCallback.mockClear();

    mockResponse = {"key": "value"};
    mockStatus = false;

    instance.onResultCb(mockResponse, mockStatus)

    expect(mockInvokeEventCallback).toHaveBeenCalled()
    expect(mockToggleMessage).toHaveBeenCalledWith("success", "Data posted successfully")

  })

  it('generateFormFields should return if form field data is empty', () => {
    //['fieldOne', 'fieldTwo', 'fieldThree']
    const mockMetadata = {
      data: []
    }
    const props = {
      ...defaultProps,
      metadata: mockMetadata
    }
    const { instance } = render(<WmForm {...props}/>).UNSAFE_getAllByType(WmForm)[0]

    instance.invokeEventCallback = jest.fn()

    instance.generateFormFields()

    expect(instance.invokeEventCallback).not.toHaveBeenCalled()
  })

  it('generateFormFields updates dynamicForm when metadata is available', () => {
    const mockDynamicFormData = ['field 1', 'field 2']
    const mockGenerateComponent =  jest.fn(() => mockDynamicFormData);
    const mockMetadata = {
      data: ['fieldOne', 'fieldTwo', 'fieldThree'],
    }
    const props = {
      ...defaultProps,
      metadata: mockMetadata,
      generateComponent: mockGenerateComponent,
      onBeforerender: jest.fn()
    }
    const { instance } = render(<WmForm {...props}/>).UNSAFE_getAllByType(WmForm)[0]

    instance.invokeEventCallback = jest.fn(() => true)

    instance.generateFormFields()

    expect(instance.invokeEventCallback).toHaveBeenCalled()
  })

  it('setPrimaryKey updates primary key of form field', () => {
    const { instance } = render(<WmForm {...defaultProps}/>).UNSAFE_getAllByType(WmForm)[0];

    instance.setPrimaryKey('someKey')

    expect(instance.primaryKey).toEqual(['someKey']) 
  })

  it('dataoutput returns formdataoutput', () => {
    const { instance } = render(<WmForm {...defaultProps}/>).UNSAFE_getAllByType(WmForm)[0];

    instance.formdataoutput = 'some data output'

    expect(instance.dataoutput).toEqual('some data output') 
  })

  it('handleSubmit calls event.preventDefault if event is passed', () => {
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const mockEvent = { preventDefault: jest.fn() };
    instance.validateFieldsOnSubmit = jest.fn(() => false); // prevent further logic
    instance.handleSubmit(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('handleSubmit calls getFormDataOutput and passes formData to invokeHandleSubmitCallbackFromProps when validation passes and no onBeforesubmit', () => {
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const mockFormData = { foo: 'bar' };
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.getFormDataOutput = jest.fn(() => mockFormData);
    instance.invokeHandleSubmitCallbackFromProps = jest.fn();
    instance.handleSubmit();
    expect(instance.getFormDataOutput).toHaveBeenCalled();
    expect(instance.invokeHandleSubmitCallbackFromProps).toHaveBeenCalledWith(mockFormData);
  });

  it('handleSubmit calls onBeforesubmit and then invokeHandleSubmitCallbackFromProps if no asyncResult', () => {
    const onBeforesubmitMock = jest.fn();
    const props = { ...defaultProps, onBeforesubmit: onBeforesubmitMock };
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const mockFormData = { foo: 'bar' };
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.getFormDataOutput = jest.fn(() => mockFormData);
    instance.invokeEventCallback = jest.fn();
    instance.invokeHandleSubmitCallbackFromProps = jest.fn();
    instance.proxy = {}; // no asyncResult
    instance.handleSubmit();
    expect(instance.invokeEventCallback).toHaveBeenCalledWith('onBeforesubmit', [undefined, instance.proxy, mockFormData]);
    expect(instance.invokeHandleSubmitCallbackFromProps).toHaveBeenCalledWith(mockFormData);
  });

  it('handleSubmit handles asyncResult promise from onBeforesubmit and calls invokeHandleSubmitCallbackFromProps after resolve', () => {
    const onBeforesubmitMock = jest.fn();
    const props = { ...defaultProps, onBeforesubmit: onBeforesubmitMock };
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const mockFormData = { foo: 'bar' };
    const updatedFormData = { foo: 'baz' };
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.getFormDataOutput = jest
      .fn()
      .mockReturnValueOnce(mockFormData)
      .mockReturnValueOnce(updatedFormData);
    instance.invokeEventCallback = jest.fn();
    instance.invokeHandleSubmitCallbackFromProps = jest.fn();

    const mockPromise = {
      then: jest.fn((callback) => {
        callback('resolved');
        return mockPromise;
      }),
      catch: jest.fn()
    };
    instance.proxy = { asyncResult: mockPromise };
    instance.handleSubmit();

    expect(instance.invokeEventCallback).toHaveBeenCalledWith('onBeforesubmit', [undefined, instance.proxy, mockFormData]);
    expect(mockPromise.then).toHaveBeenCalled();
    expect(instance.invokeHandleSubmitCallbackFromProps).toHaveBeenCalledWith(updatedFormData);
  });

  it('handleSubmit returns false and does not call any callbacks if validation fails', () => {
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.validateFieldsOnSubmit = jest.fn(() => false);
    instance.getFormDataOutput = jest.fn();
    instance.invokeEventCallback = jest.fn();
    instance.invokeHandleSubmitCallbackFromProps = jest.fn();
    const result = instance.handleSubmit();
    expect(result).toBe(false);
    expect(instance.getFormDataOutput).not.toHaveBeenCalled();
    expect(instance.invokeEventCallback).not.toHaveBeenCalled();
    expect(instance.invokeHandleSubmitCallbackFromProps).not.toHaveBeenCalled();
  });
});