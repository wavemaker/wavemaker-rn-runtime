import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import WmForm from '@wavemaker/app-rn-runtime/components/data/form/form.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import WmMessage from '@wavemaker/app-rn-runtime/components/basic/message/message.component';
import { ToastConsumer, ToastService, ToastProvider } from '@wavemaker/app-rn-runtime/core/toast.service';

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
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps} parentForm="parentForm" />);
    const instance = UNSAFE_getByType(WmForm).instance;
    const mockGetParentFormRef = jest.fn()
    instance.getParentFormRef = mockGetParentFormRef
    instance.componentDidMount();
    expect(mockGetParentFormRef).toHaveBeenCalled()
  });

  it('getParentFormRef adds parentFormRef to the instance', () => {
    const { UNSAFE_getByType } = render(<WmForm {...defaultProps}/>)
    const instance = UNSAFE_getByType(WmForm).instance;
    const someInstance = { instance: 'some-instance' };
    const parent = {
      'props.name': 'form'
    } 
    instance.parent = parent;
    instance.getParentFormRef('form');
    expect(instance.parentFormRef).toEqual(parent)
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

  it('setReadonlyState updates readonly state correctly', async () => {
    jest.useFakeTimers();
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;

    const mockUpdateMode = 'sample updateMode';
    await waitFor(() => {
      instance.setReadonlyState(mockUpdateMode)
      expect(instance.state.isUpdateMode).toEqual(mockUpdateMode)
      jest.useRealTimers()  
    })
  })
  
  it('form actions - edit, new, cancel', () => {
    const tree = render(<WmForm {...defaultProps}/>);
    const instance = tree.UNSAFE_getByType(WmForm).instance;

    const mockSetReadOnlyState = jest.fn()
    instance.setReadonlyState = mockSetReadOnlyState;
    instance.edit();
    expect(mockSetReadOnlyState).toHaveBeenCalledWith(true)

    instance.setReadonlyState = mockSetReadOnlyState;
    instance.new();
    expect(mockSetReadOnlyState).toHaveBeenCalledWith(true)

    instance.setReadonlyState = mockSetReadOnlyState;
    instance.cancel();
    expect(mockSetReadOnlyState).toHaveBeenCalledWith(false)

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
    
    const props = {
      ...defaultProps,
      onBeforesubmit: jest.fn()
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.invokeEventCallback = jest.fn(() => true);
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.handleSubmit();
    
    expect(instance.invokeEventCallback).toHaveBeenCalled()
  });


  it('form submit should invoke formSubmit from props and resultCB if it is provided and formSubmit is succeeded', () => {
    
    const mockFormSubmit = jest.fn((data, cb, failure) => cb(data));
    const props = {
      ...defaultProps,
      formSubmit: mockFormSubmit
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.invokeEventCallback = jest.fn(() => true);
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.onResultCb = jest.fn()
    instance.handleSubmit();
    
    expect(instance.props.formSubmit).toHaveBeenCalled();
    expect(instance.invokeEventCallback).toHaveBeenCalled();
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
    instance.invokeEventCallback = jest.fn(() => true);
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.onResultCb = jest.fn()
    instance.handleSubmit();
    
    expect(instance.props.formSubmit).toHaveBeenCalled();
    expect(instance.invokeEventCallback).toHaveBeenCalled();
    expect(instance.onResultCb).toHaveBeenCalledWith('some error', '');
  });

  it('form submit should invoke onsubmit callback when onSubmit is not provided as prop', () => {
    
    const props = {
      ...defaultProps,
    }
    const { UNSAFE_getByType } = render(<WmForm {...props} />);
    const instance = UNSAFE_getByType(WmForm).instance;
    instance.invokeEventCallback = jest.fn(() => true);
    instance.validateFieldsOnSubmit = jest.fn(() => true);
    instance.handleSubmit();
    
    expect(instance.invokeEventCallback).toHaveBeenCalled();
  });


});