<<<<<<< HEAD
import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
=======
import React, { createRef } from 'react';
import {act, fireEvent, render, userEvent, waitFor} from '@testing-library/react-native';
>>>>>>> 5472d1b6 (WMS-26669 | update: handle autoCapitalize property for web view)
import WmText from '@wavemaker/app-rn-runtime/components/input/text/text.component';

describe('Test Text component', () => {
    test('Check validity of sample component', () => {
      const tree = renderer.create(<WmText name="test_Text"/>).toJSON();
      expect(tree).toMatchSnapshot();
    });

    await waitFor(() => {
      expect(getByText('Floating Label')).toBeTruthy();
    });
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
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} disabled={true} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });

  test('should handle readonly prop correctly', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} readonly={true} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });

  test('should handle maxchars prop correctly', () => {
    const maxchars = 10;
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} maxchars={maxchars} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.maxLength).toBe(maxchars);
  });

  test('should handle secureTextEntry prop correctly for password type', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type="password" />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should render floating label', () => {
    const { getByText } = render(
      <WmText {...defaultProps} floatinglabel="Test Label" />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  test.skip('should render field in invalid state when isValid is false', async () => {
    const invalidStyle = { borderColor: 'red' };
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} styles={{ invalid: invalidStyle }} />
    );

    const input = getByPlaceholderText('Enter text');
    const inputStyleArr = input.props.style[0];
    const inputStyle = {};
    inputStyleArr.forEach((item) => {
      if (!item) return;
      Object.keys(item).forEach((key) => {
        inputStyle[key] = item[key];
      });
    });

    fireEvent.changeText(input, 'text exceeding validation');

    await waitFor(() => {
      expect(inputStyle).toMatchObject(invalidStyle);
    });
  });

  test('should secureTextEntry true for password inputs when maskchar is falsy', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type="password" maskchar={null} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should impose displayformat accurately', () => {
    const customRef = createRef();
    const displayformat = '999-999-9999';
    const tree = render(
      <WmText {...defaultProps} displayformat={displayformat} ref={customRef} />
    );
    const { getByText, UNSAFE_getByType } = tree;
    const input = UNSAFE_getByType(TextInput);

    fireEvent.changeText(input, '1231231234');
    expect(getByText('123-123-1234')).toBeTruthy();
  });

  test('should mask characters accurately when maskchar is provided', async () => {
    const maskchar = '*';
    const { getByPlaceholderText, getByText } = render(
      <WmText {...defaultProps} maskchar={maskchar} updateon='default'/>
    );
    const input = getByPlaceholderText('Enter text');
    act(() => {
      fireEvent.changeText(input, '123456');
    });

    await waitFor(()=>{
      expect(getByText('******')).toBeTruthy();
    })
  });

  test('should hide skeleton when showSkeleton is false', () => {
    const { queryByTestId } = render(
      <WmText {...defaultProps} showskeleton={false} />
    );
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
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} autocomplete={true} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.autoComplete).toBe('username');
  });

  test('should auto complete off if autocomplete prop is false', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} autocomplete={false} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.autoComplete).toBe('off');
  });

  test('should have default value for native platform', () => {
    const tree = render(<WmText {...defaultProps} datavalue="sample text" />);
    expect(tree.UNSAFE_getByType(TextInput).props.defaultValue).toBe(
      'sample text'
    );
    expect(tree).toMatchSnapshot();
  });

  test('should have default value for web platform', () => {
    (Platform as any).OS = 'web';

    const tree = render(<WmText {...defaultProps} datavalue="sample text" />);
    expect(tree.UNSAFE_getByType(TextInput).props.value).toBe('sample text');
    expect(tree).toMatchSnapshot();
  });

  test('should not show component when show prop is false', () => {
    const tree = render(<WmText {...defaultProps} show={false} />);

    const styleArr = tree.getByPlaceholderText('Enter text').props.style[0];
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

  test('should have keyboardType as numeric for type as number', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type="number" />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('numeric');
  });

  test('should have keyboardType as phone-pad for type as tel', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type="tel" />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('phone-pad');
  });

  test('should have keyboardType as email-address for type as email', () => {
    const { getByPlaceholderText } = render(
      <WmText {...defaultProps} type="email" />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.keyboardType).toBe('email-address');
  });

  test('should assign autoCapitalize prop in textinput component', () => {
    Platform.OS = 'ios';
    const { getByPlaceholderText } = render(
      <WmText 
        {...defaultProps} 
        autocapitalize='characters' 
      />
    );

    const input = getByPlaceholderText("Enter text");
    expect(input.props.autoCapitalize).toBe("characters")
  });

  test('should change the text to capital weh autoCapitalize prop is set to characters', async () => {
    const { getByPlaceholderText } = render(
      <WmText 
        {...defaultProps} 
        autocapitalize='characters' 
        updateon='default'
      />
    );

    const input = getByPlaceholderText("Enter text");

    fireEvent(input, 'changeText', 'hello');

    expect(input.props.autoCapitalize).toBe("characters")

    await waitFor(()=>{
      expect(input.props.defaultValue).toBe("HELLO")
    })
  });
<<<<<<< HEAD

  test('should update the state when hastwowaybinding is enabled', async () => {
    injector.FOCUSED_ELEMENT.remove = jest.fn();
    const tree = render(
      <WmText 
        {...defaultProps} 
        updateon='blur'
        hastwowaybinding={true}
        datavalue={"hello"}
      />
    );

    const input = tree.getByPlaceholderText("Enter text");

    await waitFor(()=>{
      expect(input.props.defaultValue).toBe("hello")
    })

    fireEvent(input, 'changeText', 'hello world');
    await new Promise((resolve: any, reject) => setTimeout(()=>{resolve()}, 800));
    fireEvent(input, 'blur')
    await new Promise((resolve: any, reject) => setTimeout(()=>{resolve()}, 800));

    expect(input.props.defaultValue).toBe("hello world")
  });

  test('should update the text after some time when updateon prop is lazy', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmText.prototype,
      'invokeEventCallback'
    );

    const { getByPlaceholderText } = render(
      <WmText 
        {...defaultProps} 
        updateon='lazy'
      />
    );

    const input = getByPlaceholderText('Enter text');

    fireEvent(input, 'changeText', 'hello');
    expect(invokeEventCallbackMock).not.toHaveBeenCalled();

    await new Promise((resolve: any, reject) => setTimeout(()=>{resolve()}, 200));

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onChange', expect.arrayContaining(['hello']));
  });
=======
>>>>>>> 5472d1b6 (WMS-26669 | update: handle autoCapitalize property for web view)
});
