import React, { createRef } from 'react';
import { Text, View } from 'react-native';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import WmDialog from '@wavemaker/app-rn-runtime/components/dialogs/dialog/dialog.component';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

const renderComponent = (props: any = {}) => {
  const defaultProps = {
    id: 'test-dialog',
    show: true,
    title: 'Test Title',
    modal: true,
    closable: false,
    showheader: true,
  };
  const loadAsset = (path) => path;

  AppModalService.modalsOpened = [];

  return render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmDialog {...defaultProps} {...props} />
      </AssetProvider>
    </ModalProvider>
  );
};

const ChildrenComponent = () => (
  <View>
    <Text>Children Component</Text>
  </View>
);

describe('Test Dialog component', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  //The render tree will always be null
  //The dom is assigned to AppModalService.
  test('renders correctly with default props', () => {
    renderComponent();
    const renderOptions = AppModalService.modalsOpened[0];

    expect(
      renderOptions.content.props.children.props.children.props.testID
    ).toBeTruthy();
    expect(
      renderOptions.content.props.children.props.children.props.testID
    ).toBe('wm-dialog');
  });

  test('should render header component when showheader is passed as true ', () => {
    renderComponent({ showheader: true });
    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];

    expect(headerComponent.props.testID).toBeTruthy();
    expect(headerComponent.props.testID).toBe('wm-dialog-header');
  });

  test('should render header icon when iconclass is given in props', () => {
    renderComponent({ iconclass: 'fa fa-info' });

    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];
    const iconComponent = headerComponent.props?.children[0]?.props?.children;

    expect(headerComponent.props.testID).toBeTruthy();
    expect(headerComponent.props.testID).toBe('wm-dialog-header');
    expect(iconComponent).toBeTruthy();
    expect(iconComponent.props.id).toBe('test-dialog_icon');
    expect(iconComponent.props.caption).toBe('Test Title');
  });

  test('should renders the close button when closable is true', () => {
    renderComponent({ closable: true });
    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];

    expect(headerComponent.props.testID).toBeTruthy();
    expect(headerComponent.props.testID).toBe('wm-dialog-header');

    const closeButtonComponent = headerComponent.props?.children[1];

    expect(closeButtonComponent).toBeTruthy();
    expect(closeButtonComponent.props.id).toBe('test-dialog_closebtn');
  });

  test('should not render the close button when closable is false', () => {
    renderComponent({ closable: false });
    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];

    expect(headerComponent.props.testID).toBeTruthy();
    expect(headerComponent.props.testID).toBe('wm-dialog-header');

    const closeButtonComponent = headerComponent.props?.children[1];

    expect(closeButtonComponent).toBeFalsy();
  });

  test('should not render header icon when iconclass is not given in props or is falsy', () => {
    renderComponent({ iconclass: null });
    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];

    expect(headerComponent.props.testID).toBeTruthy();
    expect(headerComponent.props.testID).toBe('wm-dialog-header');

    const iconComponent = headerComponent.props?.children[0]?.props?.children;

    expect(iconComponent).toBeFalsy();
  });

  test('should not render header component when showheader is passed as false ', () => {
    renderComponent({ showheader: false });
    const renderOptions = AppModalService.modalsOpened[0];
    const parentContainer = renderOptions.content.props.children.props.children;
    const headerComponent = parentContainer.props.children[1];

    expect(headerComponent).toBeFalsy();
  });

  test('should call invokeEventCallback with onOpened when component is being rendered', async () => {
    const customRef = createRef<WmDialog>();
    const eventCallBackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(eventCallBackMock).toHaveBeenCalled();
      expect(eventCallBackMock).toHaveBeenCalledWith('onOpened', [
        null,
        customRef.current,
      ]);
    });
  });

  test('should call invokeEventCallback with onOpened when open method is called', async () => {
    const customRef = createRef<WmDialog>();
    const eventCallBackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    renderComponent({ ref: customRef });

    act(() => {
      customRef.current.open();
    });

    await waitFor(() => {
      expect(eventCallBackMock).toHaveBeenCalled();
      expect(eventCallBackMock).toHaveBeenCalledWith('onOpened', [
        null,
        customRef.current,
      ]);
    });
  });

  test('should call invokeEventCallback with onOpened when show state is false and open method is called', async () => {
    const customRef = createRef<WmDialog>();
    const eventCallBackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    const updateStateMock = jest.spyOn(WmDialog.prototype, 'updateState');
    renderComponent({ ref: customRef });

    act(() => {
      customRef.current.state.props.show = false;
    });

    act(() => {
      customRef.current.open();
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalledWith({ props: { show: true } });
      expect(eventCallBackMock).toHaveBeenCalled();
      expect(eventCallBackMock).toHaveBeenCalledWith('onOpened', [
        null,
        customRef.current,
      ]);
    });
  });

  test('should call invokeEventCallback with onClose when close method is called', async () => {
    const customRef = createRef<WmDialog>();
    const eventCallBackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    const updateStateMock = jest.spyOn(WmDialog.prototype, 'updateState');
    renderComponent({ ref: customRef });

    act(() => {
      customRef.current.close();
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(updateStateMock).toHaveBeenCalledWith(
        {
          props: { show: false },
        },
        expect.any(Function)
      );
      expect(eventCallBackMock).toHaveBeenCalled();
      expect(eventCallBackMock).toHaveBeenCalledWith('onClose', [
        null,
        customRef.current,
      ]);
    });
  });

  test('should call invokeEventCallback with onClose when close button is pressed', async () => {
    const customRef = createRef<WmDialog>();
    const eventCallBackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    const updateStateMock = jest.spyOn(WmDialog.prototype, 'updateState');

    renderComponent({ ref: customRef, closable: true });
    const renderOptions = AppModalService.modalsOpened[0];
    const Component = () => {
      return <>{renderOptions.content}</>;
    };
    const { getByText } = render(<Component />);
    fireEvent(getByText('close'), 'press');

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(updateStateMock).toHaveBeenCalledWith(
        {
          props: { show: false },
        },
        expect.any(Function)
      );
      expect(eventCallBackMock).toHaveBeenCalled();
      expect(eventCallBackMock).toHaveBeenCalledWith('onClose', [
        null,
        customRef.current,
      ]);
    });
  });

  test('should renders children inside the dialog', () => {
    renderComponent({
      iconclass: 'fa fa-info',
      children: <ChildrenComponent />,
    });
    const renderOptions = AppModalService.modalsOpened[0];
    const Component = () => {
      return <>{renderOptions.content}</>;
    };
    const tree = render(<Component />);

    expect(tree.getByText('Children Component')).toBeDefined();
  });
});
