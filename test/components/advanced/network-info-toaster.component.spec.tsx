import React, { createRef } from 'react';
import { View } from 'react-native';
import { act, cleanup, render, waitFor } from '@testing-library/react-native';
import WmNetworkInfoToaster from '@wavemaker/app-rn-runtime/components/advanced/network-info-toaster/network-info-toaster.component';
import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';
import {
  ToastProvider,
  ToastOptions,
} from '@wavemaker/app-rn-runtime/core/toast.service';

const renderComponent = (props = {}) => {
  const defaultProps = {
    id: 'testToaster',
    appLocale: {
      messages: {
        MESSAGE_SERVICE_CONNECTED: 'Service Connected',
        MESSAGE_SERVICE_CONNECTING: 'Service Connecting',
        MESSAGE_SERVICE_AVAILABLE: 'Service Available',
        MESSAGE_NETWORK_NOT_AVAILABLE: 'Network Not Available',
        MESSAGE_SERVICE_NOT_AVAILABLE: 'Service Not Available',
        LABEL_HIDE_NETWORK_INFO: 'Hide Network Info',
        LABEL_CONNECT_TO_SERVICE: 'Connect to Service',
      },
    },
  };

  return render(
    <ToastProvider
      value={{
        showToast: (arg: ToastOptions) => <View>{arg.content}</View>,
        hideToast: (arg: any) => null,
      }}
    >
      <WmNetworkInfoToaster {...defaultProps} {...props} />
    </ToastProvider>
  );
};

// Mock NetworkService
jest.mock('@wavemaker/app-rn-runtime/core/network.service', () => ({
  getState: jest.fn(),
  isConnected: jest.fn(),
  notifier: {
    subscribe: jest.fn((event, callback) => {
      if (event === 'onNetworkStateChange') {
        callback({
          isConnected: false,
          isConnecting: false,
          isServiceAvailable: false,
          isNetworkAvailable: false,
        });
      }
      return jest.fn();
    }),
  },
}));

describe('WmNetworkInfoToaster Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.clearAllMocks();
  })

  test('should not crash and render nothing if appLocale is missing', () => {
    const { toJSON } = renderComponent({ appLocale: undefined });
    expect(toJSON()).toBeNull();
  });

  test('should not crash and render nothing if appLocale.messages is missing', () => {
    const { toJSON } = renderComponent({ appLocale: {} });
    expect(toJSON()).toBeNull();
  });

  test('should return null when network network status is same as previous', () => {
    const tree = renderComponent();
    expect(tree.toJSON() && (tree.toJSON() as any).children).toBeNull();
  });

  test('should return null when showToast is false', async () => {
    const customRef = createRef<any>();
    const tree = renderComponent({ ref: customRef });

    act(() => {
      customRef.current.setState({
        showToast: false,
      });
    });

    await waitFor(() => {
      expect(customRef.current.state.showToast).toBe(false);
      expect(tree.toJSON() && (tree.toJSON() as any).children).toBeNull();
    });
  });

  test('should return null even if showToast is true', async () => {
    const customRef = createRef<any>();
    const tree = renderComponent({ ref: customRef });

    act(() => {
      customRef.current.setState({
        showToast: true,
      });
    });

    await waitFor(() => {
      expect(customRef.current.state.showToast).toBe(true);
      expect(tree.toJSON() && (tree.toJSON() as any).children).toBeNull();
    });
  });

  test('option content should have the render component', () => {
    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];
    const secondChildren = content.props.children[2].props.children;

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Network Not Available');
    expect(secondChildren.props.children).toBe('Hide Network Info');
  });

  test('shows correct message for service connected', async () => {
    (NetworkService.getState as jest.Mock).mockReturnValueOnce({
      isConnected: true,
      isConnecting: false,
      isServiceAvailable: true,
      isNetworkAvailable: true,
    });
    
    const customRef = createRef<any>();
    const updateStateMock = jest.spyOn(
      WmNetworkInfoToaster.prototype,
      'updateState'
    );
    renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(updateStateMock).toHaveBeenCalledWith({
        newtworkState: {
          isConnected: false,
          isConnecting: false,
          isServiceAvailable: false,
          isNetworkAvailable: false,
        },
        showToast: true,
      });
    });
  });

  test('shows correct message when service available is true', async () => {
    (NetworkService.getState as jest.Mock).mockReturnValue({
      isConnected: false,
      isConnecting: false,
      isServiceAvailable: true,
      isNetworkAvailable: false,
    });

    (NetworkService.notifier.subscribe as jest.Mock).mockImplementation(
      () => {}
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];
    const secondChildren = content.props.children[2].props.children;
    const thirdChildren = content.props.children[4].props.children;

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Service Available');
    expect(secondChildren.props.children).toBe('Hide Network Info');
    expect(thirdChildren.props.children).toBe('Connect to Service');
  });

  test('shows correct message when network available is false', async () => {
    (NetworkService.getState as jest.Mock).mockReturnValue({
      isConnected: false,
      isConnecting: false,
      isServiceAvailable: false,
      isNetworkAvailable: false,
    });

    (NetworkService.notifier.subscribe as jest.Mock).mockImplementation(
      () => {}
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];
    const secondChildren = content.props.children[2].props.children;

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Network Not Available');
    expect(secondChildren.props.children).toBe('Hide Network Info');
  });

  test('shows correct message when network is connected', () => {
    (NetworkService.getState as jest.Mock).mockReturnValue({
      isConnected: true,
      isConnecting: false,
      isServiceAvailable: false,
      isNetworkAvailable: false,
    });

    (NetworkService.notifier.subscribe as jest.Mock).mockImplementation(
      () => {}
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];
    const secondChildren = content.props.children[2].props.children;

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Service Connected');
    expect(secondChildren.props.children).toBe('Hide Network Info');
  });

  test('shows correct message when network is connecting', () => {
    (NetworkService.getState as jest.Mock).mockReturnValue({
      isConnected: false,
      isConnecting: true,
      isServiceAvailable: false,
      isNetworkAvailable: false,
    });

    (NetworkService.notifier.subscribe as jest.Mock).mockImplementation(
      () => {}
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Service Connecting');
  });

  test('shows correct message when network available is true but isConnected, isConnecting and isServiceAvailable is false', () => {
    (NetworkService.getState as jest.Mock).mockReturnValue({
      isConnected: false,
      isConnecting: false,
      isServiceAvailable: false,
      isNetworkAvailable: true,
    });

    (NetworkService.notifier.subscribe as jest.Mock).mockImplementation(
      () => {}
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });
    const content = (customRef.current as any).options.content;
    const firstChildren = content.props.children[1];
    const secondChildren = content.props.children[2].props.children;

    expect(content.type.displayName).toBe('View');
    expect(content.children).not.toBeNull();
    expect(firstChildren.props.children).toBe('Service Not Available');
    expect(secondChildren.props.children).toBe('Hide Network Info');
  });
  
  test('should hide toaster when onClose is called', async () => {
    (NetworkService.getState as jest.Mock).mockReturnValueOnce({
      isConnected: true,
      isConnecting: false,
      isServiceAvailable: true,
      isNetworkAvailable: true,
    });

    const updateStateMock = jest.spyOn(
      WmNetworkInfoToaster.prototype,
      'updateState'
    );

    const customRef = createRef<any>();
    renderComponent({ ref: customRef });

    act(() => {
      (customRef.current as any).options.onClose();
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(updateStateMock).toHaveBeenCalledWith({
        showToast: false,
      });
    });
  });
});
