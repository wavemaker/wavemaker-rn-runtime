import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { WMTextInput } from '@wavemaker/app-rn-runtime/core/components/textinput.component';
import { Platform, TextInput } from 'react-native';

describe('TextInput Component', () => {
  const defaultProps = {
    allowContentSelection: false,
    displayformat: '',
    maskchar: '',
    floatingLabelStyle: {},
    activeFloatingLabelStyle: {},
    onChangeText: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    placeholder: 'Enter text',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with default props', () => {
    const tree = render(<WMTextInput {...defaultProps} />);
    expect(tree).toMatchSnapshot();
    expect(tree.UNSAFE_getByType(TextInput)).toBeTruthy();
  });

  test('should show floating label when focused', () => {
    const tree = render(
      <WMTextInput {...defaultProps} floatingLabel="Floating Label" />
    );

    const input = tree.UNSAFE_getByType(TextInput);
    act(() => {
      fireEvent(input, 'focus', {
        target: null,
      });
    });
    expect(tree).toMatchSnapshot();
    expect(tree.getByText('Floating Label')).toBeTruthy();
  });

  test('should call onChangeText with the correct value', () => {
    const { getByPlaceholderText } = render(<WMTextInput {...defaultProps} />);
    const input = getByPlaceholderText('Enter text');
    act(() => {
      fireEvent.changeText(input, 'test');
    });
    expect(defaultProps.onChangeText).toHaveBeenCalledWith('test');
  });

  test('should call onFocus and onBlur when input is focused and blurred', () => {
    const { getByPlaceholderText } = render(<WMTextInput {...defaultProps} />);
    const input = getByPlaceholderText('Enter text');
    act(() => {
      fireEvent(input, 'focus', {
        event: {
          target: null,
        },
      });
    });
    expect(defaultProps.onFocus).toHaveBeenCalled();

    act(() => {
      fireEvent(input, 'blur');
    });
    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  test('should mask characters if maskchar is provided', () => {
    const { getByPlaceholderText, queryByText } = render(
      <WMTextInput {...defaultProps} maskchar="*" />
    );
    const input = getByPlaceholderText('Enter text');

    act(() => {
      fireEvent.changeText(input, '1234');
    });

    expect(queryByText('****')).toBeTruthy();
  });

  test('should format input based on displayformat', async () => {
    const propsWithFormat = {
      ...defaultProps,
      displayformat: '99-999',
    };

    const tree = render(<WMTextInput {...propsWithFormat} />);

    expect(tree).toMatchSnapshot();

    const input = tree.UNSAFE_getByType(TextInput);

    act(() => {
      fireEvent.changeText(input, '12345');
    });

    expect(tree.queryByText('12-345')).toBeTruthy();
  });

  test('should not allow content selection if allowContentSelection is false when platform is android', async () => {
    (Platform as any).OS = 'android';
    const tree = render(<WMTextInput {...defaultProps} />);
    const input = tree.getByPlaceholderText('Enter text');

    act(() => {
      fireEvent(input, 'selectionChange', {
        nativeEvent: { selection: { start: 0, end: 4 } },
      });
    });

    await waitFor(() => {
      expect(tree).toMatchSnapshot();
    });

    expect(input.props).toHaveProperty('caretHidden', true);
    expect(input.props).toHaveProperty('contextMenuHidden', true);
  });

  test('should handle floatingLabel prop correctly', () => {
    const { queryByText } = render(
      <WMTextInput {...defaultProps} floatingLabel="Custom Label" />
    );
    expect(queryByText('Custom Label')).toBeTruthy();
  });

  test('should hide cursor when hideInput is true', () => {
    const { UNSAFE_getByType } = render(
      <WMTextInput {...defaultProps} displayformat="99-99" />
    );
    const input = UNSAFE_getByType(TextInput);
    expect(input.props).toHaveProperty('selectionColor', 'transparent');
    expect(input.props).toHaveProperty('cursorColor', 'transparent');
  });

  test('updates correctly on prop change', () => {
    const { getByPlaceholderText, rerender } = render(
      <WMTextInput {...defaultProps} value="Initial" />
    );
    const input = getByPlaceholderText('Enter text');

    rerender(<WMTextInput {...defaultProps} value="Updated" />);
    expect(input.props.value).toBe('Updated');
  });

  test('should render custom cursor', () => {
    const tree = render(
      <WMTextInput {...defaultProps} displayCursor={true} maskchar="*" />
    );

    fireEvent(tree.getByPlaceholderText('Enter text'), 'focus', {
      target: null,
    });

    expect(tree).toMatchSnapshot();
    expect(tree.getByTestId('wm-custom-cursor')).toBeTruthy();
  });

  test('should not render custom cursor when testinput is not focused', () => {
    const tree = render(
      <WMTextInput {...defaultProps} displayCursor={true} maskchar="*" />
    );

    fireEvent(tree.getByPlaceholderText('Enter text'), 'blur');

    expect(tree).toMatchSnapshot();
    expect(tree.queryByTestId('wm-custom-cursor')).toBeNull();
  });

  test('should not render custom cursor when maskchar prop is falsy', () => {
    const tree = render(
      <WMTextInput {...defaultProps} displayCursor={true} maskchar="" />
    );

    fireEvent(tree.getByPlaceholderText('Enter text'), 'focus', {
      target: null,
    });

    expect(tree).toMatchSnapshot();
    expect(tree.queryByTestId('wm-custom-cursor')).toBeNull();
  });

  test('should not render custom cursor when displayformat value is passed', () => {
    const tree = render(
      <WMTextInput
        {...defaultProps}
        displayCursor={true}
        displayformat="99-99"
      />
    );

    fireEvent(tree.UNSAFE_getByType(TextInput), 'focus', {
      target: null,
    });

    expect(tree).toMatchSnapshot();
    expect(tree.queryByTestId('wm-custom-cursor')).toBeNull();
  });

  test('should render the customDisplayValue text when it is passed in props', async () => {
    Platform.OS = 'ios';
    const tree = render(
      <WMTextInput {...defaultProps} customDisplayValue="500%" />
    );
    const input = tree.UNSAFE_getByType(TextInput);

    fireEvent.changeText(input, '200');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(input.props.defaultValue).toBe('500%');
  });

  test('should apply autoCapitalize prop in InputText component', async () => {
    Platform.OS = 'ios';
    const tree = render(
      <WMTextInput {...defaultProps} autoCapitalize="characters" />
    );
    const input = tree.UNSAFE_getByType(TextInput);
    expect(input.props.autoCapitalize).toBe('characters');
  });

  test('should change the text to capital weh autoCapitalize prop is set to characters', async () => {
    console.log('platform is: ', Platform.OS);
    const { UNSAFE_getByType, getByText } = render(
      <WMTextInput {...defaultProps} autoCapitalize="characters" />
    );

    const input = UNSAFE_getByType(TextInput);

    fireEvent(input, 'changeText', 'hello');
    fireEvent(input, 'blur', {
      target: {
        value: null,
      },
    });

    expect(input.props.autoCapitalize).toBe('characters');
    await waitFor(() => {
      expect(defaultProps.onChangeText).toHaveBeenCalledWith('HELLO');
    });
  });
});
