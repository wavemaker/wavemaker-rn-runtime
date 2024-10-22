import React, { createRef } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import WmCurrency from '@wavemaker/app-rn-runtime/components/input/currency/currency.component';
import { CURRENCY_INFO } from '@wavemaker/app-rn-runtime/core/currency-constants';
import { Platform, TextInput } from 'react-native';

const defaultProps = {
  currency: 'USD',
  placeholder: 'Enter amount',
  datavalue: null,
  minvalue: null,
  maxvalue: null,
  step: 1,
  required: false,
  readonly: false,
  disabled: false,
  decimalPlaces: 2,
};

describe('Test Currency component', () => {
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
      <WmCurrency {...defaultProps} floatinglabel="Amount" />
    );
    const { getByText, UNSAFE_getByType } = tree;

    expect(getByText(CURRENCY_INFO[defaultProps.currency].symbol)).toBeTruthy();
    expect(UNSAFE_getByType(TextInput)).toBeTruthy();
    expect(getByText('Amount')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should set the currency symbol on props.currency change', async () => {
    const { getByText, rerender } = render(<WmCurrency {...defaultProps} />);
    expect(getByText(CURRENCY_INFO[defaultProps.currency].symbol)).toBeTruthy();

    rerender(<WmCurrency {...defaultProps} currency="EUR" />);
    // Ensure the new currency symbol is present
    await waitFor(() => {
      expect(getByText(CURRENCY_INFO['EUR'].symbol)).toBeTruthy();
    });
  });

  test('should handle input change correctly', () => {
    const onChangeTextMock = jest.spyOn(WmCurrency.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmCurrency {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'currency');
  });

  test('should validate number correctly', () => {
    const onChangeTextMock = jest.spyOn(WmCurrency.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmCurrency {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Check if the value is set correctly
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'currency');

    // Check invalid values
    fireEvent.changeText(input, '12.34563');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Should remain unchanged if invalid
    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'currency');
  });

  xit('should not accept negative number', async () => {
    const updateStateMock = jest.spyOn(WmCurrency.prototype, 'updateState');
    const onChangeTextMock = jest.spyOn(WmCurrency.prototype, 'onChangeText');
    const customRef = createRef<WmCurrency>();
    const { getByPlaceholderText } = render(
      <WmCurrency {...defaultProps} ref={customRef} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '-123.45');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    // Check if the value is set correctly
    expect(onChangeTextMock).toHaveBeenCalledWith('-123.45', 'currency');
    await waitFor(() => {
      expect(customRef.current.state.textValue).toBe(null);
    });
  });

  test('should validate number correctly, only supports "e" as a character', () => {
    const onChangeTextMock = jest.spyOn(WmCurrency.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmCurrency {...defaultProps} />);
    const input = getByPlaceholderText(defaultProps.placeholder);

    fireEvent.changeText(input, '123.45');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('123.45', 'currency');

    fireEvent.changeText(input, '10e');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'currency');

    fireEvent.changeText(input, '10a');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'currency');

    fireEvent.changeText(input, '$$');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(onChangeTextMock).toHaveBeenCalledWith('10e', 'currency');
  });

  test('should enable input if disabled and readonly props are falsy', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmCurrency {...defaultProps} readonly={true} disabled={true} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);
    expect(input.props.editable).toBe(false);

    rerender(
      <WmCurrency {...defaultProps} readonly={false} disabled={false} />
    );
    expect(input.props.editable).toBe(true);
  });

  test('should disable input if disabled is true', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmCurrency {...defaultProps} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    rerender(<WmCurrency {...defaultProps} disabled={true} />);
    expect(input.props.editable).toBe(false);
  });

  test('should disable input if readonly props is true', () => {
    const { getByPlaceholderText, rerender } = render(
      <WmCurrency {...defaultProps} />
    );
    const input = getByPlaceholderText(defaultProps.placeholder);

    rerender(<WmCurrency {...defaultProps} readonly={true} />);
    expect(input.props.editable).toBe(false);
  });

  xit('should validate against required prop correctly', () => {
    const customRef = createRef();
    const { getByPlaceholderText } = render(
      <WmCurrency {...defaultProps} ref={customRef} updateon="default" />
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
      <WmCurrency {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.defaultValue).toBe(
      'sample text'
    );
    expect(tree).toMatchSnapshot();
  });

  test('should have default value for "platform=web"', () => {
    (Platform as any).OS = 'web';

    const tree = render(
      <WmCurrency {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.value).toBe('sample text');
    expect(tree).toMatchSnapshot();
  });

  test('should not show component when show prop is false', () => {
    const tree = render(<WmCurrency {...defaultProps} show={false} />);

    expect(tree.toJSON().props.style).toMatchObject({
      height: 0,
      width: 0,
    });
  });

  xit('should isValid false when input number is below minvalue', async () => {
    const onChangeTextMock = jest.spyOn(WmCurrency.prototype, 'onChangeText');
    const customRef = createRef();
    const tree = render(
      <WmCurrency
        {...defaultProps}
        minvalue={100}
        // maxvalue={1000}
        ref={customRef}
        updateon="default"
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
      expect(onChangeTextMock).toHaveBeenCalledWith('500', 'currency');
      expect(customRef.current.state.isValid).toBe(true);
    });

    fireEvent.changeText(input, '10');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(onChangeTextMock).toHaveBeenCalledWith('10', 'currency');
      expect(customRef.current.state.isValid).toBe(false);
    });
  });

  test('should isValid false when input number is above maxvalue', async () => {
    const updateStateMock = jest.spyOn(WmCurrency.prototype, 'updateState');
    const customRef = createRef();
    const tree = render(
      <WmCurrency
        {...defaultProps}
        maxvalue={1000}
        ref={customRef}
        updateon="default"
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
      expect(updateStateMock).toHaveBeenCalledWith({ isValid: true });
      expect(customRef.current.state.isValid).toBe(true);
    });

    fireEvent.changeText(input, '50011');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalledWith({ isValid: false });
      expect(customRef.current.state.isValid).toBe(false);
    });
  });
});
