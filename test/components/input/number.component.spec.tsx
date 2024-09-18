import React, { createRef } from 'react';
import { Platform, TextInput } from 'react-native';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react-native';
import WmNumber from '@wavemaker/app-rn-runtime/components/input/number/number.component';

const defaultProps = {
  placeholder: 'Enter amount',
  datavalue: null,
  minvalue: null,
  maxvalue: null,
  step: 1,
  required: false,
  readonly: false,
  disabled: false,
  decimalPlaces: 2,
  name:'wm-text-input'
};

describe('Number component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  test('should render correctly with default props', () => {
    const tree = render(
      <WmNumber {...defaultProps} floatinglabel="Amount" />
    );
    const { getByText, UNSAFE_getByType } = tree;

    expect(UNSAFE_getByType(TextInput)).toBeTruthy();
    expect(getByText('Amount')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should handle input change correctly', () => {
    const onChangeTextMock = jest.spyOn(WmNumber.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmNumber {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'number');
  });

  test('should validate number correctly', () => {
    const onChangeTextMock = jest.spyOn(WmNumber.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmNumber {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Check if the value is set correctly
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'number');

    // Check invalid values
    fireEvent.changeText(input, '12.34563');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Should remain unchanged if invalid
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'number');
  });
  test('should validate number correctly, only supports "e" as a character', () => {
    const onChangeTextMock = jest.spyOn(WmNumber.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmNumber {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'number');

    fireEvent.changeText(input, '10e');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'number');

    fireEvent.changeText(input, '10a');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'number');

    fireEvent.changeText(input, '$$');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'number');
  });

  test('should enable input if disabled and readonly props are falsy', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmNumber {...defaultProps} readonly={true} disabled={true} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);
    expect(input.props.editable).toBe(false);

    rerender(
      <WmNumber {...defaultProps} readonly={false} disabled={false} />
    );
    expect(input.props.editable).toBe(true);
  });

  test('should disable input if disabled is true', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmNumber {...defaultProps} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    rerender(<WmNumber {...defaultProps} disabled={true} />);
    expect(input.props.editable).toBe(false);
  });

  test('should disable input if readonly props is true', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmNumber {...defaultProps} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    rerender(<WmNumber {...defaultProps} readonly={true} />);
    expect(input.props.editable).toBe(false);
  });

  test('should validate against required prop correctly', () => {
    const customRef = createRef();
    const { getByPlaceholderText } = render(
      <WmNumber {...defaultProps} ref={customRef} updateon='default'/>
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Check if input indicates invalid state
    expect(customRef.current.state.isValid).toBe(false);
  });

  test('should have default value for native platform', () => {
    const tree = render(
      <WmNumber {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.defaultValue).toBe(
      'sample text'
    );
    expect(tree).toMatchSnapshot();
  });

  test('should have default web for native platform', () => {
    (Platform as any).OS = 'web';

    const tree = render(
      <WmNumber {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.value).toBe('sample text');
    expect(tree).toMatchSnapshot();
  });

  test('should not show component when show prop is false', () => {
    const tree = render(<WmNumber {...defaultProps} show={false} />);
    const styleArr = tree.toJSON().props.style[0];
    const style = {};
    
    styleArr.forEach(item => {
      if(!item) return;
      Object.keys(item).forEach(key => {
        style[key] = item[key];
      })
    });

    expect(style).toMatchObject({
      height: 0,
      width: 0,
    });
    expect(tree).toMatchSnapshot();
  });

  test('should isValid false when input number is below minvalue', async () => {
    const onChangeTextMock = jest.spyOn(WmNumber.prototype, 'onChangeText');
    const customRef = createRef();
    const tree = render(
      <WmNumber
        {...defaultProps}
        minvalue={100}
        // maxvalue={1000}
        ref={customRef}
        updateon='default'
      />
    );
    const input = tree.getByPlaceholderText('Enter amount');

    fireEvent.changeText(input, '500');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('500', 'number');
      expect(customRef.current.state.isValid).toBe(true);
    });

    fireEvent.changeText(input, '10');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('10', 'number');
      expect(customRef.current.state.isValid).toBe(false);
    });
  });

  test('should isValid false when input number is above maxvalue', async () => {
    const updateStateMock = jest.spyOn(WmNumber.prototype, 'updateState');
    const customRef = createRef();
    const tree = render(
      <WmNumber
        {...defaultProps}
        maxvalue={1000}
        ref={customRef}
        updateon='default'
      />
    );
    const input = tree.getByPlaceholderText('Enter amount');

    fireEvent.changeText(input, '500');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalledWith({isValid: true});
      expect(customRef.current.state.isValid).toBe(true); 
      expect(tree).toMatchSnapshot();
    });

    fireEvent.changeText(input, '50011');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalledWith({isValid: false});
      expect(customRef.current.state.isValid).toBe(false);
      expect(tree).toMatchSnapshot();
    });
  });

  test('should render the displayValue text when it is passed in props', async () => {
    Platform.OS = 'ios'
    const tree = render(
      <WmNumber
        {...defaultProps}
        maxvalue={1000}
        updateon='default'
        displayValue='500%'
      />
    );
    const input = tree.getByPlaceholderText('Enter amount');

    fireEvent.changeText(input, '200');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(input.props.defaultValue).toBe('500%');
  })
});