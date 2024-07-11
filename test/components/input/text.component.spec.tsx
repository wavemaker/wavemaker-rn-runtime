import React, { createRef } from 'react';
import {act, fireEvent, render, waitFor} from '@testing-library/react-native';
import WmText from '@wavemaker/app-rn-runtime/components/input/text/text.component';
import { Platform, TextInput } from 'react-native';

const defaultProps = {
  id: 'wmText',
  name: 'wmText',
  // floatinglabel: 'Enter text',
  placeholder: 'Enter text',
  disabled: false,
  show: true,
  styles: null,
  classname: null,
  listener: null,
  showindevice: null,
  showskeleton: false,
  deferload: false,
  // onChangeText: jest.fn(),
};

describe('Text component', () => {
  test('should render correctly with default props', () => {
    const tree = render(<WmText {...defaultProps} />);
    expect(tree.getByPlaceholderText('Enter text')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should show floating label when focused', async () => {
    const tree = render(<WmText {...defaultProps} floatinglabel='Floating Label'/>);
    const { UNSAFE_getByType, queryByText, getByText } = tree;
    const input = UNSAFE_getByType(TextInput);

    fireEvent(input, 'focus', {
      target: null
    });

    await waitFor(()=>{
      expect(getByText('Floating Label')).toBeTruthy();
      expect(tree).toMatchSnapshot();
    })
  });

  test('should call onChangeText with correct value', () => {
    const onChangeTextMock = jest.spyOn(WmText.prototype, 'onChangeText');

    const { getByPlaceholderText } = render(<WmText {...defaultProps} />);
    const input = getByPlaceholderText('Enter text');
    const text = 'test';

    fireEvent.changeText(input, text);
    
    expect(onChangeTextMock).toHaveBeenCalledWith(text);
  });

  test('should handle disabled prop correctly', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} disabled={true} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });

  test('should handle readonly prop correctly', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} readonly={true} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });

  test('should handle maxchars prop correctly', () => {
    const maxchars = 10;
    const { getByPlaceholderText } = render(<WmText {...defaultProps} maxchars={maxchars} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.maxLength).toBe(maxchars);
  });

  test('should handle secureTextEntry prop correctly for password type', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} type="password" />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should render floating label', () => {
    const { getByText } = render(
      <WmText {...defaultProps} floatinglabel="Test Label" />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  test('should render field in invalid state when isValid is false', async () => {
    const invalidStyle = { borderColor: 'red' };
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} styles={{ invalid: invalidStyle }}/>
    );

    const input = getByPlaceholderText('Enter text');
    const inputStyleArr = input.props.style[0];
    const inputStyle = {};
    inputStyleArr.forEach(item => {
      if(!item) return;
      Object.keys(item).forEach(key => {
        inputStyle[key] = item[key];
      })
    })

    fireEvent.changeText(input, 'text exceeding validation');
    
    await waitFor(()=>{
      expect(inputStyle).toMatchObject(invalidStyle);
    })
  });

  test('should secureTextEntry true for password inputs when maskchar is falsy', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} type="password" maskchar={null} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should impose displayformat accurately', () => {
    const customRef = createRef();
    const displayformat = '999-999-9999';
    const tree = render(
      <WmText {...defaultProps} displayformat={displayformat} ref={customRef}/>
    );
    const { getByText, UNSAFE_getByType } = tree;
    const input = UNSAFE_getByType(TextInput);

    fireEvent.changeText(input, '1231231234');
    expect(getByText('123-123-1234')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should mask characters accurately when maskchar is provided', () => {
    const maskchar = '*';
    const { getByPlaceholderText, queryByText } = render(
      <WmText {...defaultProps} maskchar={maskchar} />
    );
    const input = getByPlaceholderText('Enter text');
    act(() => {
      fireEvent.changeText(input, '123456');
    });
    expect(input.props.value).toBe('******');
    expect(queryByText('******')).toBeTruthy();
  });

  test('should hide skeleton when showSkeleton is false', () => {
    const { queryByTestId } = render(<WmText {...defaultProps} showskeleton={false} />);
    const skeleton = queryByTestId('skeleton');
    expect(skeleton).toBeNull();
  });

  test('renders with accessibility properties', () => {
    const { getByLabelText } = render(
      <WmText {...defaultProps} accessibilitylabel="Text input" />
    );
    const input = getByLabelText('Text input');
    expect(input.props.accessibilityLabel).toBe('Text input');
  });

  test('should auto complete username if autocomplete prop is provided', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} autocomplete={true} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.autoComplete).toBe('username');
  });

  test('should auto complete off if autocomplete prop is false', () => {
    const { getByPlaceholderText } = render(<WmText {...defaultProps} autocomplete={false} />);
    const input = getByPlaceholderText('Enter text');
    expect(input.props.autoComplete).toBe('off');
  });

  test('should have default value for native platform', () => {
    const tree = render(<WmText {...defaultProps} datavalue="sample text"/>)
    expect(tree.UNSAFE_getByType(TextInput).props.defaultValue).toBe("sample text");
    expect(tree).toMatchSnapshot();
  })

  test('should have default web for native platform', () => {
    (Platform as any).OS = 'web';

    const tree = render(<WmText {...defaultProps} datavalue="sample text"/>)
    expect(tree.UNSAFE_getByType(TextInput).props.value).toBe("sample text");
    expect(tree).toMatchSnapshot();
  })

  test('should not show component when show prop is false', () => {
    const tree = render(<WmText {...defaultProps} show={false}/>)
    expect(tree).toMatchSnapshot();

    const styleArr = tree.getByPlaceholderText("Enter text").props.style[0];
    const style = {};
    styleArr.forEach(item => {
      if(!item) return;
      Object.keys(item).forEach(key => {
        style[key] = item[key]
      })
    })

    expect(style).toMatchObject({
      height: 0,
      width:0
    })
  });

  test('should have keyboardType as numeric for type as number', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type='number' />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('numeric')
  });

  test('should have keyboardType as phone-pad for type as tel', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type='tel' />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('phone-pad')
  });

  test('should have keyboardType as email-address for type as email', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type='email' />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('email-address')
  });
});