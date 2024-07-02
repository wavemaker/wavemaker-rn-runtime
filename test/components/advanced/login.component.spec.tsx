import React, { ReactNode, createRef, useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmLogin from '@wavemaker/app-rn-runtime/components/advanced/login/login.component';

import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import WmLoginProps from '../../../src/components/advanced/login/login.props';
import { ThemeProvider } from '@wavemaker/app-rn-runtime/styles/theme';
import { AxiosError, AxiosResponse } from 'axios';
import ThemeVariables from '../../../src/styles/theme.variables';

// Mock Theme
const mockTheme = {
  getStyle: (styleName: string) => ({}), // Adjust based on required styles
  mergeStyle: (style1, style2) => ({ ...style1, ...style2 }),
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider value={mockTheme}>{component}</ThemeProvider>);
};

describe('WmLogin', () => {
  it('renders correctly with default props', () => {
    const props: WmLoginProps = { children: <></>, onLogin: jest.fn() };

    const { getByTestId } = render(<WmLogin {...props} />);
    const loginComponent = getByTestId('login_component');

    expect(loginComponent).toBeTruthy();
  });

  it('calls onLogin function when doLogin is executed', () => {
    const onLoginMock = jest.fn();
    const ref = createRef();
    const formData = { username: 'test', password: 'test' };
    const props: WmLoginProps = { children: <></>, onLogin: onLoginMock };

    const tree = render(<WmLogin {...props} ref={ref} />);
    act(() => {
      ref.current.doLogin(formData);
    });

    expect(onLoginMock).toHaveBeenCalledWith(
      formData,
      expect.any(Function),
      expect.any(Function)
    );
  });

  it('renders children components', () => {
    const props: WmLoginProps = {
      children: <Text testID="child">Login Form</Text>,
      onLogin: jest.fn(),
    };

    const { getByTestId } = render(<WmLogin {...props} />);
    const childComponent = getByTestId('child');

    expect(childComponent).toBeTruthy();
    expect(childComponent.props.children).toBe('Login Form');
  });

  it('triggers onLoginSuccess callback correctly', () => {
    const response = { data: 'success' } as AxiosResponse;
    const ref = createRef();
    const onLoginMock = jest.fn((formData, onSuccess) => {
      onSuccess(response);
    });

    const props: WmLoginProps = { children: <></>, onLogin: onLoginMock };
    const onLoginSuccess = jest.spyOn(WmLogin.prototype, 'onLoginSuccess');
    const { getByTestId } = render(<WmLogin {...props} ref={ref} />);

    act(() => {
      ref.current.doLogin({});
    });

    expect(onLoginMock).toHaveBeenCalled();
    expect(onLoginSuccess).toHaveBeenCalled();
  });

  it('triggers onLoginError callback correctly and shows error', async () => {
    const error = { message: 'Error occurred' } as AxiosError;
    const ref = createRef();
    const onLoginMock = jest.fn((formData, onSuccess, onError) => {
      onError(error);
    });

    const props: WmLoginProps = { children: <></>, onLogin: onLoginMock };
    const onLoginError = jest.spyOn(WmLogin.prototype, 'onLoginError');
    const { getByText } = render(<WmLogin {...props} ref={ref} />);

    act(() => {
      ref.current.doLogin({});
    });
    const themeVariables = new ThemeVariables();
    expect(onLoginMock).toHaveBeenCalled();
    await waitFor(() => {
      const errorText = getByText(error.message);
      expect(errorText).toBeTruthy();
      expect(errorText.props.style.backgroundColor).toBe(
        themeVariables.loginErrorMsgBgColor
      );
      expect(errorText.props.style.borderColor).toBe(
        themeVariables.loginErrorMsgBorderColor
      );
    });
    expect(onLoginError).toHaveBeenCalled();
  });

  it('should have width and height to be 0 when show is false', () => {
    const props = {
      children: <></>,
      onLogin: jest.fn(),
      show: false,
    };

    const { getByTestId } = render(<WmLogin {...props} />);
    const loginComp = getByTestId('login_component');
    expect(loginComp.props.style.width).toBe(0);
    expect(loginComp.props.style.height).toBe(0);
  });

  it('should render width and height', () => {
    const width = 50;
    const height = 70;
    const props = {
      children: <></>,
      onLogin: jest.fn(),
      styles: {
        root: {
          width: width,
          height: height,
        },
      },
    };
    const { getByTestId } = render(<WmLogin {...props} />);
    const loginEle = getByTestId('login_component');
    expect(loginEle.props.style.width).toBe(width);
    expect(loginEle.props.style.height).toBe(height);
  });
});
