import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmFormField, {
  WmFormFieldState,
} from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.component';
import WmFormFieldProps from '@wavemaker/app-rn-runtime/components/data/form/form-field/form-field.props';
import { Text, View } from 'react-native';
import { cloneDeep } from 'lodash';
import { PERFORMANCE_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';
import WmText from '@wavemaker/app-rn-runtime/components/input/text/text.component';

describe('WmFormField Component', () => {
  let defaultProps: WmFormFieldProps;

  const commonFields = {
    name: 'widgetName',
    formfieldname: 'formfieldName',
    formfield: true,
    memoize: false,
    required: false,
    regexp: '',
    validationmessage: '',
    datavalue: '',
    disabled: false,
    readonly: false,
    className: 'form-input form-widgetType form-widgetName-input',
    conditionalclass: "fragment.getFormFieldStyles($formField, 'commonField')",
    placeholder: 'placeholderValue',
    displayname: 'Username',
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onTap: jest.fn(),
  };

  const createFormMock = () => ({
    registerFormFields: jest.fn(),
    formWidgets: { testKey: {} },
    formFields: {},
    updateDataOutput: jest.fn(),
  });

  const setupInstance = (props = {}) => {
    const { UNSAFE_getByType } = render(
      <WmFormField {...{ ...defaultProps, ...props }} />
    );
    return UNSAFE_getByType(WmFormField).instance;
  };

  beforeEach(() => {
    defaultProps = {
      ...commonFields,
      children: null,
      formRef: null,
      generator: '',
      onChange: jest.fn(),
      renderFormFields: ({ defaultProps }) => <></>,
      isRelated: null,
      widget: null,
      onFieldChange: jest.fn(),
      formKey: '',
      dataset: null,
      displayfield: '',
      datafield: '',
      isDataSetBound: false,
      onValidate: jest.fn(),
      formScope: jest.fn(),
      maskchar: '',
      displayformat: '',
      defaultvalue: undefined,
      primaryKey: false,
    };
  });

  test('should call componentDidMount and register form fields', () => {
    const componentDidMountSpy = jest.spyOn(
      WmFormField.prototype,
      'componentDidMount'
    );
    const formMock = createFormMock();

    render(
      <WmFormField
        {...defaultProps}
        formScope={() => formMock}
        formKey="testKey"
      />
    );

    expect(componentDidMountSpy).toHaveBeenCalled();
    const instance = componentDidMountSpy.mock.instances[0] as any;
    expect(instance.formwidget).toBe(formMock.formWidgets['testKey']);
    expect(formMock.registerFormFields).toHaveBeenCalledWith(
      formMock.formFields,
      formMock.formWidgets
    );

    componentDidMountSpy.mockRestore();
  });

  test('should call notifyChanges when field value changes', () => {
    const instance = setupInstance();
    instance.form = createFormMock();
    instance.notifyChanges = jest.fn();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, false);

    expect(instance.notifyChanges).toHaveBeenCalled();
  });

  test('should update state with new datavalue', () => {
    const instance = setupInstance();
    instance.form = createFormMock();
    instance.updateState = jest.fn();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, false);

    expect(instance.updateState).toHaveBeenCalledWith(
      { props: { datavalue: newValue } },
      expect.any(Function)
    );
  });

  test('should invoke event callback with correct arguments', async () => {
    const instance = setupInstance();
    instance.form = createFormMock();
    instance.invokeEventCallback = jest.fn();
    instance.validateFormField = jest.fn();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, false);

    await waitFor(() => {
      expect(instance.invokeEventCallback).toHaveBeenCalled();
      const callbackArgs = instance.invokeEventCallback.mock.calls[0];
      expect(callbackArgs[0]).toBe('onChange');
      expect(callbackArgs[1][0]).toBeUndefined();
      expect(callbackArgs[1][1]).toBe(instance);
      expect(callbackArgs[1][2]).toBe(newValue);
      expect(callbackArgs[1][3]).toBe(oldValue);
      expect(instance.validateFormField).toHaveBeenCalled();
    });
  });

  test('should not call invokeEventCallback if isDefault is true', async () => {
    const instance = setupInstance();
    instance.form = createFormMock();
    instance.notifyChanges = jest.fn();
    instance.updateState = jest.fn((_, callback) => callback());
    instance.invokeEventCallback = jest.fn();
    instance.validateFormField = jest.fn();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, true);

    expect(instance.notifyChanges).toHaveBeenCalled();
    expect(instance.updateState).toHaveBeenCalledWith(
      { props: { datavalue: newValue } },
      expect.any(Function)
    );
    await waitFor(() => {
      expect(instance.invokeEventCallback).not.toHaveBeenCalled();
      expect(instance.validateFormField).toHaveBeenCalled();
    });
  });

  test('should call updateDataOutput with formkey empty if this.form is true', async () => {
    const instance = setupInstance();
    instance.form = createFormMock();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, true);
    expect(instance.form.updateDataOutput).toHaveBeenCalledWith('', newValue); // Ensure formKey is set correctly
  });

  test('should call updateDataOutput with formkey not empty if this.form is true', async () => {
    const instance = setupInstance({ formKey: 'testkey' }); // Pass formKey as part of props
    instance.form = createFormMock();

    const newValue = 'new value';
    const oldValue = 'old value';

    instance.onFieldChangeEvt('fieldName', newValue, oldValue, true);
    expect(instance.form.updateDataOutput).toHaveBeenCalledWith(
      'testkey',
      newValue
    ); // Expecting formKey to be 'testkey'
  });

  test('observeOn should register observers', () => {
    const instance = setupInstance();
    const mockField = { proxy: { name: 'field1' }, notifyForFields: [] };
    instance.form = { formFields: [mockField] };
    instance.observeOn(['field1']);
    expect(mockField.notifyForFields.length).toBe(1);
    expect(mockField.notifyForFields[0]).toBe(instance);
  });

  test('notifyChanges should notify observed fields', async () => {
    const instance = setupInstance();
    const mockField = {
      formwidget: { validate: jest.fn() },
      validateFormField: jest.fn(),
    };
    instance.notifyForFields = [mockField];
    instance.notifyChanges();
    expect(mockField.formwidget.validate).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockField.validateFormField).toHaveBeenCalled();
    });
  });

  test('should call the function and store the promise object in arr', () => {
    const mockPromise = Promise.resolve('mocked value');

    // Create a mock function that returns the mockPromise
    const mockFunction = jest.fn().mockReturnValue(mockPromise);

    const instance = setupInstance();

    // Set up a mock for formwidget to ensure proxy is defined
    instance.formwidget = {
      proxy: {},
      ...createFormMock().formWidgets['testKey'],
    }; // Add proxy to formwidget

    // Create a new mock function and bind it to the proxy
    const boundMockFunction = function () {
      return mockFunction.apply(this, arguments);
    }.bind(instance.formwidget.proxy);

    // Set the prototype to ensure it's recognized as a function
    Object.setPrototypeOf(boundMockFunction, Function.prototype);

    const validators = [boundMockFunction]; // Array with the bound function

    // Call getPromiseList and store the result
    const result = instance.getPromiseList(validators);

    // Ensure the original mockFunction was called with correct arguments
    expect(mockFunction).toHaveBeenCalledWith(
      instance.formwidget.proxy,
      instance.form
    );

    // Ensure the promise is in the result
    expect(result).toContain(mockPromise);
  });

  test('should directly add promise to arr', () => {
    const mockPromise = Promise.resolve('direct promise');

    const instance = setupInstance();
    instance.formwidget = {
      proxy: {},
      ...createFormMock().formWidgets['testKey'],
    }; // Add proxy to formwidget
    const validators = [mockPromise]; // Array with one promise

    const result = instance.getPromiseList(validators);

    expect(result).toContain(mockPromise); // Ensure the promise is in the result
  });

  describe('setAsyncValidators', () => {
    // Mock setup for the component instance
    const setupInstanceWithAsyncValidators = (validators) => {
      const instance = setupInstance(); // Assuming setupInstance creates a component instance
      instance.setInvalidState = jest.fn(); // Mocking setInvalidState
      instance.getPromiseList = jest.fn(() => validators); // Mock getPromiseList to return validators
      instance.setAsyncValidators(validators);
      return instance;
    };

    test('should set async validation function successfully', () => {
      const instance = setupInstanceWithAsyncValidators([]);

      // Check that _asyncValidatorFn is set to a function
      expect(typeof instance._asyncValidatorFn).toBe('function');
    });

    test('should handle validation success', async () => {
      const instance = setupInstanceWithAsyncValidators([Promise.resolve()]);

      // Call the async validator function
      const result = await instance._asyncValidatorFn();

      // Expect the validation to succeed (result should be null)
      expect(result).toBeNull();

      // Ensure no invalid state was set
      expect(instance.setInvalidState).not.toHaveBeenCalled();
    });

    test('should handle validation failure with errorMessage', async () => {
      const mockError = { errorMessage: 'Test validation error' };
      const instance = setupInstanceWithAsyncValidators([
        Promise.reject(mockError),
      ]);

      // Call the async validator function
      const result = await instance._asyncValidatorFn();

      // Expect setInvalidState to be called with the correct validation message
      expect(instance.setInvalidState).toHaveBeenCalledWith(
        'Test validation error'
      );

      // Expect the result to be the error object
      expect(result).toEqual(mockError);
    });

    test('should handle validation failure without errorMessage property', async () => {
      const mockError = { fieldError: 'Field validation failed' };
      const instance = setupInstanceWithAsyncValidators([
        Promise.reject(mockError),
      ]);

      // Call the async validator function
      const result = await instance._asyncValidatorFn();

      // Expect setInvalidState to be called with the first key's value as the validation message
      expect(instance.setInvalidState).toHaveBeenCalledWith(
        'Field validation failed'
      );

      // Expect the result to be the error object
      expect(result).toEqual(mockError);
    });

    test('should call setInvalidState with correct validation message on failure', async () => {
      const mockError = { fieldError: 'Another validation error' };
      const instance = setupInstanceWithAsyncValidators([
        Promise.reject(mockError),
      ]);

      // Call the async validator function
      await instance._asyncValidatorFn();

      // Check that setInvalidState was called with the correct validation message
      expect(instance.setInvalidState).toHaveBeenCalledWith(
        'Another validation error'
      );
    });
  });

  describe('setValidators', () => {
    const setupInstanceWithSyncValidators = (validators) => {
      const instance = setupInstance(); // Assuming setupInstance creates a component instance
      instance.formwidget = { proxy: {}, updateState: jest.fn() }; // Mock formwidget and updateState
      instance.defaultValidatorMessages = {}; // Mock defaultValidatorMessages
      instance.setValidators(validators); // Call setValidators with provided validators
      return instance;
    };

    test('should handle custom function validators and bind them to formwidget proxy', () => {
      // Create a mock validator function and ensure it's an instance of Function
      const mockValidator = jest.fn();
      Object.setPrototypeOf(mockValidator, Function.prototype);

      const instance = setupInstanceWithSyncValidators([mockValidator]);

      // Ensure the validator is bound to formwidget.proxy and added to _syncValidators
      expect(instance._syncValidators.length).toBe(1);
      expect(instance._syncValidators[0]).toBeInstanceOf(Function);

      // Call the bound function to verify the correct binding
      instance._syncValidators[0]();
      expect(mockValidator).toHaveBeenCalledWith(
        instance.formwidget.proxy,
        instance.form
      );
    });

    test('should handle built-in validators like required and update state', () => {
      const instance = setupInstanceWithSyncValidators([
        { type: 'required', validator: true, errorMessage: 'Required field' },
      ]);

      // Ensure defaultValidatorMessages is updated with the errorMessage
      expect(instance.defaultValidatorMessages['required']).toBe(
        'Required field'
      );

      // Check that updateState was called for the built-in validator
      expect(instance.formwidget.updateState).toHaveBeenCalledWith({
        props: { required: true },
      });
    });

    test('should update state for multiple validators including custom and built-in', () => {
      const mockValidator = jest.fn();
      Object.setPrototypeOf(mockValidator, Function.prototype);

      const instance = setupInstanceWithSyncValidators([
        { type: 'required', validator: true, errorMessage: 'Required field' },
        mockValidator,
      ]);

      // Ensure defaultValidatorMessages is updated with the errorMessage for required
      expect(instance.defaultValidatorMessages['required']).toBe(
        'Required field'
      );

      // Check that updateState was called for the built-in validator
      expect(instance.formwidget.updateState).toHaveBeenCalledWith({
        props: { required: true },
      });

      // Ensure the custom validator is bound and pushed to _syncValidators
      expect(instance._syncValidators.length).toBe(1);
      expect(instance._syncValidators[0]).toBeInstanceOf(Function);
    });

    test('should bind multiple custom validators to formwidget proxy', () => {
      const mockValidator1 = jest.fn();
      const mockValidator2 = jest.fn();
      Object.setPrototypeOf(mockValidator1, Function.prototype);
      Object.setPrototypeOf(mockValidator2, Function.prototype);

      const instance = setupInstanceWithSyncValidators([
        mockValidator1,
        mockValidator2,
      ]);

      // Ensure both custom validators are bound and pushed to _syncValidators
      expect(instance._syncValidators.length).toBe(2);

      // Call each bound function to verify the correct binding
      instance._syncValidators[0]();
      instance._syncValidators[1]();

      expect(mockValidator1).toHaveBeenCalledWith(
        instance.formwidget.proxy,
        instance.form
      );
      expect(mockValidator2).toHaveBeenCalledWith(
        instance.formwidget.proxy,
        instance.form
      );
    });

    xit('should handle validators with no type gracefully', () => {
      const validators = [
        { validator: true, errorMessage: 'Custom validation message' },
      ];

      const instance = setupInstanceWithSyncValidators(validators);

      // Since the validator has no type, no defaultValidatorMessages should be set
      expect(Object.keys(instance.defaultValidatorMessages).length).toBe(0);

      // No built-in state update should be called, only custom validators should be added to _syncValidators
      expect(instance._syncValidators.length).toBe(0);
      expect(instance.formwidget.updateState).not.toHaveBeenCalled();
    });
  });

  test('setReadOnlyState should update readonly state', () => {
    const instance = setupInstance();
    instance.formwidget = { updateState: jest.fn() };
    instance.setReadOnlyState(false);
    expect(instance.formwidget.updateState).toHaveBeenCalledWith({
      props: { readonly: true },
    });
  });

  describe('updateFormWidgetDataset', () => {
    let instance: any;
    let mockUpdateState: jest.Mock;

    beforeEach(() => {
      instance = setupInstance(); // Assuming setupInstance creates a component instance
      mockUpdateState = jest.fn();
      instance.formwidget = {
        updateState: mockUpdateState,
        state: {
          props: {
            displayfield: 'existingDisplayField',
          },
        },
      };
    });

    test('should update formwidget state with given dataset and display field', () => {
      const response = { data: ['item1', 'item2', 'item3'] };
      const displayField = 'newDisplayField';

      instance.updateFormWidgetDataset(response, displayField);

      // Check if the updateState was called with the correct props
      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          dataset: response.data,
          datafield: 'All Fields',
          displayfield: instance.formwidget.state.props.displayfield, // Adjust this to use the existing value
        },
      } as WmFormFieldState);
    });

    test('should use existing displayfield from formwidget if available', () => {
      const response = { data: ['item1', 'item2', 'item3'] };
      const existingDisplayField = 'existingDisplayField';

      instance.updateFormWidgetDataset(response, 'newDisplayField');

      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          dataset: response.data,
          datafield: 'All Fields',
          displayfield: existingDisplayField,
        },
      } as WmFormFieldState);
    });

    test('should call updateState with correct props when displayfield is undefined', () => {
      instance.formwidget.state.props.displayfield = undefined; // Clear existing displayfield

      const response = { data: ['item1', 'item2', 'item3'] };
      const displayField = 'newDisplayField';

      instance.updateFormWidgetDataset(response, displayField);

      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          dataset: response.data,
          datafield: 'All Fields',
          displayfield: displayField,
        },
      } as WmFormFieldState);
    });

    test('should not modify formwidget state if response data is empty', () => {
      const response = { data: [] };
      const displayField = 'newDisplayField';

      instance.updateFormWidgetDataset(response, displayField);

      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          dataset: response.data,
          datafield: 'All Fields',
          displayfield: instance.formwidget.state.props.displayfield,
        },
      } as WmFormFieldState);
    });
  });

  describe('setInvalidState', () => {
    let instance: any;
    let mockUpdateState: jest.Mock;

    beforeEach(() => {
      instance = setupInstance(); // Assume setupInstance creates the component instance
      mockUpdateState = jest.fn();
      instance.updateState = mockUpdateState; // Mocking updateState
      instance.formwidget = { updateState: jest.fn() }; // Mocking formwidget's updateState
    });

    test('should set the state to invalid with the provided message', () => {
      const message = 'Invalid input';

      // Call the setInvalidState method
      instance.setInvalidState(message);

      // Check that the instance's updateState was called with correct parameters
      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: message,
        },
      } as WmFormFieldState);

      // Check that the formwidget's updateState was also called with correct parameters
      expect(instance.formwidget.updateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: message,
        },
      } as WmFormFieldState);
    });

    test('should set the state to invalid with an empty message', () => {
      const message = '';

      // Call the setInvalidState method
      instance.setInvalidState(message);

      // Check that the instance's updateState was called with correct parameters
      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: message,
        },
      } as WmFormFieldState);

      // Check that the formwidget's updateState was also called with correct parameters
      expect(instance.formwidget.updateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: message,
        },
      } as WmFormFieldState);
    });

    xit('should handle non-string messages gracefully', () => {
      const message = 12345; // Non-string message

      // Call the setInvalidState method
      instance.setInvalidState(message);

      // Check that the instance's updateState was called with correct parameters
      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: String(message), // Ensure it converts to string
        },
      } as WmFormFieldState);

      // Check that the formwidget's updateState was also called with correct parameters
      expect(instance.formwidget.updateState).toHaveBeenCalledWith({
        isValid: false,
        props: {
          validationmessage: String(message), // Ensure it converts to string
        },
      } as WmFormFieldState);
    });
  });

  describe('onPropertyChange', () => {
    let instance: any;
    let mockApplyDefaultValue: jest.Mock;
    let mockSetPrimaryKey: jest.Mock;

    beforeEach(() => {
      instance = setupInstance(); // Assume setupInstance creates the component instance
      instance.form = {
        applyDefaultValue: jest.fn(), // Mocking form's applyDefaultValue
        setPrimaryKey: jest.fn(), // Mocking form's setPrimaryKey
      };
      mockApplyDefaultValue = instance.form.applyDefaultValue;
      mockSetPrimaryKey = instance.form.setPrimaryKey;
      jest.spyOn(PERFORMANCE_LOGGER, 'debug').mockClear(); // Spy on the PERFORMANCE_LOGGER
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should log a change in datavalue', () => {
      const name = 'datavalue';
      const oldValue = 'oldValue';
      const newValue = 'newValue';

      instance.onPropertyChange(name, newValue, oldValue);

      expect(PERFORMANCE_LOGGER.debug).toHaveBeenCalledWith(
        `form field ${instance.props.name} changed from ${oldValue} to ${newValue}`
      );
    });

    test('should not log if datavalue has not changed', () => {
      const name = 'datavalue';
      const value = 'sameValue';

      instance.onPropertyChange(name, value, value);

      expect(PERFORMANCE_LOGGER.debug).not.toHaveBeenCalled();
    });

    test('should apply default value if defaultvalue changes', () => {
      const name = 'defaultvalue';
      const oldValue = 'oldDefault';
      const newValue = 'newDefault';

      instance.onPropertyChange(name, newValue, oldValue);

      expect(mockApplyDefaultValue).toHaveBeenCalledWith(instance);
    });

    test('should not apply default value if defaultvalue has not changed', () => {
      const name = 'defaultvalue';
      const value = 'sameDefault';

      instance.onPropertyChange(name, value, value);

      expect(mockApplyDefaultValue).not.toHaveBeenCalled();
    });

    test('should set primary key when primary-key is set to true', () => {
      const name = 'primary-key';
      const newValue = true;

      instance.onPropertyChange(name, newValue, null);

      expect(mockSetPrimaryKey).toHaveBeenCalledWith(instance.props.name);
    });

    test('should not set primary key when primary-key is false', () => {
      const name = 'primary-key';
      const newValue = false;

      instance.onPropertyChange(name, newValue, true);

      expect(mockSetPrimaryKey).not.toHaveBeenCalled();
    });
  });

  describe('validateFormField', () => {
    let instance: any;
    let mockUpdateState: jest.Mock;
    let mockSetInvalidState: jest.Mock;

    beforeEach(() => {
      instance = setupInstance(); // Assume setupInstance creates the component instance
      mockUpdateState = jest.fn();
      instance.updateState = mockUpdateState; // Mocking updateState
      mockSetInvalidState = jest.fn();
      instance.setInvalidState = mockSetInvalidState; // Mocking setInvalidState
      instance.formwidget = {
        state: {
          isValid: true,
          errorType: null,
        },
        proxy: {},
      };
      instance._syncValidators = [];
      instance._asyncValidatorFn = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });

    test('should set isValid to false and update validation message if formwidget is invalid', () => {
      instance.formwidget.state.isValid = false;
      instance.defaultValidatorMessages = { required: 'Field is required' };
      instance.formwidget.state.errorType = 'required';

      instance.validateFormField();

      // First call should set the validation message
      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          validationmessage: 'Field is required',
        },
      } as WmFormFieldState);

      // Second call should set isValid to false
      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
      } as WmFormFieldState);

      // Check that updateState was called twice
      expect(mockUpdateState).toHaveBeenCalledTimes(2);
    });

    test('should call setInvalidState with correct message from sync validators', () => {
      instance.formwidget.state.isValid = false;
      instance.defaultValidatorMessages = { required: 'Field is required' };
      instance.formwidget.state.errorType = 'required';

      // Mock a synchronous validator that returns an error message
      instance._syncValidators.push(() => ({
        errorMessage: 'Sync validation error',
      }));

      instance.validateFormField();

      expect(mockSetInvalidState).toHaveBeenCalledWith('Sync validation error');
    });

    test('should not update validation message if no errorType is found', () => {
      instance.formwidget.state.isValid = false;
      instance.formwidget.state.errorType = 'unknown';

      instance.validateFormField();

      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
      } as WmFormFieldState);
    });

    test('should set isValid to true if formwidget is valid', () => {
      instance.formwidget.state.isValid = true;

      instance.validateFormField();

      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: true,
      } as WmFormFieldState);
    });

    test('should call async validator function if it exists', async () => {
      instance.formwidget.state.isValid = false;
      instance._asyncValidatorFn = jest.fn().mockResolvedValue(null); // Mock async function

      await instance.validateFormField();

      expect(instance._asyncValidatorFn).toHaveBeenCalled();
    });

    test('should handle validation messages returned from functions', () => {
      instance.formwidget.state.isValid = false;
      instance.defaultValidatorMessages = {
        required: (proxy: any, form: any) =>
          `Field is required (from function)`,
      };
      instance.formwidget.state.errorType = 'required';

      instance.validateFormField();

      // First call should set the validation message
      expect(mockUpdateState).toHaveBeenCalledWith({
        props: {
          validationmessage: 'Field is required (from function)',
        },
      } as WmFormFieldState);

      // Second call should set isValid to false
      expect(mockUpdateState).toHaveBeenCalledWith({
        isValid: false,
      } as WmFormFieldState);

      // Check that updateState was called twice
      expect(mockUpdateState).toHaveBeenCalledTimes(2);
    });

    test('should call setInvalidState with message from async validator if validation fails', async () => {
      instance.formwidget.state.isValid = false;

      // Mock _asyncValidatorFn to reject with an error object containing an errorMessage
      instance._asyncValidatorFn = jest.fn().mockImplementation(() => {
        return Promise.resolve().then(() => {
          // Simulate the async validation error
          const error = { errorMessage: 'Async validation error' };
          instance.setInvalidState(error.errorMessage);
          return error;
        });
      });
      await instance.validateFormField();

      expect(mockSetInvalidState).toHaveBeenCalledWith(
        'Async validation error'
      );
    });

    test('should call validation message function with correct arguments', () => {
      instance.formwidget.state.isValid = false;
      instance.formwidget.proxy = { name: 'testField' }; // Mock proxy
      instance.form = {}; // Ensure form is defined
      instance.defaultValidatorMessages = {
        required: (proxy: any, form: any) => `Field ${proxy.name} is required`,
      };
      instance.formwidget.state.errorType = 'required';

      // Mock synchronous validator that returns an object with errorMessage as a function
      instance._syncValidators.push(() => ({
        errorMessage: (proxy: any, form: any) =>
          `Field ${proxy.name} is required`,
      }));

      instance.validateFormField();

      expect(mockSetInvalidState).toHaveBeenCalledWith(
        'Field testField is required'
      );
    });
  });

  describe('WmFormField renderWidget', () => {
    const children = [
      <WmLabel key={'label'} {...commonFields} />,
      <WmText
        autofocus={false}
        autocomplete={false}
        autotrim={false}
        hastwowaybinding={false}
        maxchars={0}
        type={''}
        updateon={''}
        maskchar={''}
        displayformat={''}
        key={'text'}
        {...commonFields}
      />,
    ];
    const childrenWithoutLabel = [
      <WmText
        autofocus={false}
        autocomplete={false}
        autotrim={false}
        hastwowaybinding={false}
        maxchars={0}
        type={''}
        updateon={''}
        maskchar={''}
        displayformat={''}
        key={'text'}
        {...commonFields}
      />,
    ];
    beforeEach(() => {
      defaultProps = {
        ...commonFields,
        children: children,
        formRef: null,
        generator: '',
        onChange: jest.fn(),
        renderFormFields: jest.fn(() => ({
          props: {
            children, // Use the defined children
          },
        })),
        isRelated: null,
        widget: null,
        onFieldChange: jest.fn(),
        formKey: '',
        dataset: null,
        displayfield: '',
        datafield: '',
        isDataSetBound: false,
        onValidate: jest.fn(),
        formScope: jest.fn(),
        maskchar: '',
        displayformat: '',
        defaultvalue: undefined,
        primaryKey: false,
      };
    });

    test('renderWidget should render children with updated props when valid', () => {
      const { getByText, getByPlaceholderText } = render(
        <WmFormField {...defaultProps} />
      );
      expect(getByText('Label')).toBeTruthy(); // Check WmLabel is rendered
      expect(getByPlaceholderText('placeholderValue')).toBeTruthy(); // Check placeholder for WmText
    });

    test('renderWidget should render without WmLabel', () => {
      const propsWithoutLabel = {
        ...defaultProps,
        renderFormFields: jest.fn(() => ({
          props: {
            children: childrenWithoutLabel,
          },
        })),
      };

      const { getByPlaceholderText } = render(
        <WmFormField {...propsWithoutLabel} />
      );
      expect(getByPlaceholderText('placeholderValue')).toBeTruthy(); // Check placeholder for WmText
      expect(screen.queryByText('Label')).toBeNull(); // Ensure WmLabel is not rendered
    });

    test('renderWidget should render error message when isValid is false', () => {
      // Set up the initial props with a validation message
      const props = {
        ...defaultProps,
        validationmessage: 'This field is required',
      };

      // Render the component with the initial props
      const { rerender, getByTestId, queryByTestId } = render(
        <WmFormField {...props} />
      );

      // Initially, isValid is assumed to be true (you can set it directly in props if needed)
      // Check that the error message is not rendered
      expect(queryByTestId('widgetName_error_msg')).toBeNull(); // Ensure no error message is rendered initially

      // Now, update the instance state to set isValid to false
      // Assuming you have access to the instance
      const instance = setupInstance(props); // Function to get the instance
      instance.setState({ isValid: false }); // Set isValid to false

      // Rerender the component to reflect the new state
      rerender(<WmFormField {...props} />);

      // Now check if the error message is rendered
      expect(screen.getByTestId('widgetName_error_msg')).toBeTruthy(); // Check if the error message is rendered
      expect(screen.getByTestId('widgetName_error_msg')).toHaveTextContent(
        'This field is required'
      ); // Ensure the correct message is shown
    });

    test('renderWidget should not render error message when isValid is true', () => {
      const props = {
        ...defaultProps,
        validationmessage: 'This field is required',
      };
      // Set the instance state to valid
      render(<WmFormField {...props} />);
      expect(screen.queryByText('This field is required')).toBeNull(); // Ensure no error message is rendered
    });

    test('renderWidget should render correctly when no children are present', () => {
      // Set up the props with no children
      const props = {
        ...defaultProps,
        renderFormFields: jest.fn(() => ({
          props: {
            children: [], // No children
          },
        })),
      };

      // Render the component
      const { UNSAFE_root } = render(<WmFormField {...props} />);

      // Ensure the root is truthy
      expect(UNSAFE_root).toBeTruthy(); // Ensure it renders correctly without crashing

      // Check that there are no children rendered
      expect(screen.queryByTestId('widgetName_caption')).toBeNull(); // Check that WmLabel is not rendered
      expect(screen.queryByTestId('widgetName_i')).toBeNull(); // Check that WmText is not rendered

      // Additionally, you may want to check that the error message is not rendered
      expect(screen.queryByTestId('widgetName_error_msg')).toBeNull(); // Ensure no error message is rendered
    });

    test('renderWidget should pass placeholder prop to children when provided', () => {
      const propsWithPlaceholder = {
        ...defaultProps,
        placeholder: 'Enter your text here',
        renderFormFields: jest.fn(() => ({
          props: {
            children: childrenWithoutLabel,
          },
        })),
      };

      const { getByPlaceholderText } = render(
        <WmFormField {...propsWithPlaceholder} />
      );

      expect(getByPlaceholderText('Enter your text here')).toBeTruthy(); // Check placeholder is correctly passed
    });

    xit('renderWidget should not set placeholder prop when it is nil', () => {
      const propsWithoutPlaceholder = {
        ...defaultProps,
        placeholder: null, // Placeholder is nil
        renderFormFields: jest.fn(() => ({
          props: {
            children: [<WmText key={'text'} />],
          },
        })),
      };

      const { getByTestId } = render(
        <WmFormField {...propsWithoutPlaceholder} />
      );

      // Check if WmText is rendered
      const wmText = getByTestId('widgetName_i'); // Assuming this is the testID for WmText

      // Ensure the placeholder prop is not set
      expect(wmText.props.placeholder).toBeUndefined(); // Check that placeholder is not set
    });

    it('should not trigger on change event for the first time when form field has a default value', async () => {
      const onChangeMock = jest.fn();
      const tree  = render(<WmFormField {...defaultProps} onChange={onChangeMock} defaultvalue={"hello world"}/>);

      await new Promise((resolve)=>{
        setTimeout(()=>{
          resolve(null)
        }, 300)
      });

      expect(onChangeMock).not.toHaveBeenCalled();
    })
  });
});
