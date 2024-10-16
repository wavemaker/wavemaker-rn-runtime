import React, { createRef } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import WmTextarea from '@wavemaker/app-rn-runtime/components/input/textarea/textarea.component';
import { Platform, TextInput } from 'react-native';

const defaultProps = {
  id: 'wmTextarea',
  name: 'wmTextarea',
  placeholder: 'Place your text',
  disabled: false,
  show: true,
  styles: null,
  classname: null,
  listener: null,
  showindevice: null,
  showskeleton: false,
  deferload: false,
};

describe('Test Textarea component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    // jest.runOnlyPendingTimers();
    jest.useRealTimers();
    cleanup();
  });

  test('should render correctly with default props', () => {
    const tree = render(<WmTextarea {...defaultProps} />);
    expect(tree.getByPlaceholderText('Place your text')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should show floating label when focused', () => {
    const tree = render(
      <WmTextarea {...defaultProps} floatinglabel="sample label" />
    );
    const { queryByText, UNSAFE_getByType } = tree;
    const input = UNSAFE_getByType(TextInput);

    fireEvent(input, 'focus', {
      target: null,
    });

    expect(queryByText('sample label')).toBeTruthy();
  });

  test('should call onChangeText with correct value', () => {
    const onChangeTextMock = jest.spyOn(WmTextarea.prototype, 'onChangeText');
    const { getByPlaceholderText } = render(<WmTextarea {...defaultProps} />);
    const input = getByPlaceholderText('Place your text');
    const text = 'new text';

    fireEvent.changeText(input, text);

    expect(onChangeTextMock).toHaveBeenCalledWith(text);
  });

  test('should handle disabled prop correctly', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} disabled={true} />
    );
    const input = getByPlaceholderText('Place your text');

    expect(input.props.editable).toBe(false);
  });

  test('should handle readonly prop correctly', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} readonly={true} />
    );
    const input = getByPlaceholderText('Place your text');

    expect(input.props.editable).toBe(false);
  });

  test('should handle maxchars prop correctly', () => {
    const maxchars = 100;
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} maxchars={maxchars} />
    );
    const input = getByPlaceholderText('Place your text');

    expect(input.props.maxLength).toBe(maxchars);
  });

  test('should have default value for native platform', () => {
    const tree = render(
      <WmTextarea {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.defaultValue).toBe(
      'sample text'
    );
    expect(tree).toMatchSnapshot();
  });

  test('should have default value for web platform', () => {
    (Platform as any).OS = 'web';

    const tree = render(
      <WmTextarea {...defaultProps} datavalue="sample text" />
    );
    expect(tree.UNSAFE_getByType(TextInput).props.value).toBe('sample text');
    expect(tree).toMatchSnapshot();
  });

  test('should render field in invalid state when isValid is false', async () => {
    const invalidStyle = { borderColor: 'red' };
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} styles={{ invalid: invalidStyle }} />
    );
    const input = getByPlaceholderText('Place your text');
    fireEvent.changeText(input, 'text exceeding validation');

    await waitFor(() => {
      const styleArr = input.props.style[0];
      const style = {};
      styleArr.forEach((item) => {
        if (!item) return;
        Object.keys(item).forEach((key) => {
          style[key] = item[key];
        });
      });

      expect(style).toMatchObject(invalidStyle);
    });
  });

  test('should render floating label with labelformat', () => {
    const { getByText, UNSAFE_getByType } = render(
      <WmTextarea {...defaultProps} floatinglabel="Test Label" />
    );
    const input = UNSAFE_getByType(TextInput);
    expect(getByText('Test Label')).toBeTruthy();
  });

  test('should hide skeleton when showSkeleton is false', () => {
    const { queryByTestId } = render(
      <WmTextarea {...defaultProps} showskeleton={false} />
    );
    const skeleton = queryByTestId('skeleton');
    expect(skeleton).toBeNull();
  });

  test('renders with accessibility properties', async () => {
    const { getByLabelText } = render(
      <WmTextarea {...defaultProps} accessibilitylabel="Textarea input" />
    );

    await waitFor(() => {
      const input = getByLabelText('Textarea input');
      expect(input.props.accessibilityLabel).toBe('Textarea input');
    });
  });

  test('should auto complete username if autocomplete prop is provided', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} autocomplete={true} />
    );
    const input = getByPlaceholderText('Place your text');
    expect(input.props.autoComplete).toBe('username');
  });

  test('should auto complete off if autocomplete prop is not provided or falsy', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} autocomplete={false} />
    );
    const input = getByPlaceholderText('Place your text');
    expect(input.props.autoComplete).toBe('off');
  });

  test('should have keyboardType as numeric for type as number', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} type="number" />
    );

    const input = getByPlaceholderText('Place your text');
    expect(input.props.keyboardType).toBe('numeric');
  });

  test('should have keyboardType as phone-pad for type as tel', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} type="tel" />
    );

    const input = getByPlaceholderText('Place your text');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  test('should have keyboardType as email-address for type as email', () => {
    const { getByPlaceholderText } = render(
      <WmTextarea {...defaultProps} type="email" />
    );

    const input = getByPlaceholderText('Place your text');
    expect(input.props.keyboardType).toBe('email-address');
  });

  test('should not show component when show prop is false', () => {
    const tree = render(<WmTextarea {...defaultProps} show={false} />);

    const styleArr =
      tree.getByPlaceholderText('Place your text').props.style[0];
    const style = {};
    styleArr.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        style[key] = item[key];
      });
    });

    expect(style).toMatchObject({
      height: 0,
      width: 0,
    });
  });

  test('should render with default placeholder when placeholder passed as props is falsy', () => {
    const tree = render(<WmTextarea {...defaultProps} placeholder="" />);

    expect(tree.getByPlaceholderText('Place your text')).toBeTruthy();
  });
});
