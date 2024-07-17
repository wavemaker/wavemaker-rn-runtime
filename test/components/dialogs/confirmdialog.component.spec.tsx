import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import WmConfirmdialog from '@wavemaker/app-rn-runtime/components/dialogs/confirmdialog/confirmdialog.component';
import WmDialog from '@wavemaker/app-rn-runtime/components/dialogs/dialog/dialog.component';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

const defaultProps = {
  id: 'confirm',
  title: 'Delete Item',
  oktext: 'Yes',
  canceltext: 'No',
  modal: true,
  closable: true,
  show: true,
  animation: 'fade',
  onOpened: jest.fn(),
};

const renderComponent = (props = {}) => {
  const loadAsset = (path) => path;
  AppModalService.modalsOpened = [];

  return render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmConfirmdialog {...defaultProps} {...props} />
      </AssetProvider>
    </ModalProvider>
  );
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const appConfig = {
  app: {
    toastsOpened: 1,
  },
  refresh: () => {},
};

jest.mock('@wavemaker/app-rn-runtime/core/injector', () => {
  const actualInjector = jest.requireActual(
    '@wavemaker/app-rn-runtime/core/injector'
  );
  return {
    ...actualInjector,
    get: jest.fn().mockImplementation(() => {
      return appConfig;
    }),
    FOCUSED_ELEMENT: {
      get: jest.fn().mockImplementation(() => ({
        blur: jest.fn(),
      })),
    },
  };
});

describe('Test Confirmdialog component', () => {
  //The render tree will always be null
  //The dom is assigned to AppModalService.
  test('should render WmConfirmdialog with default props', async () => {
    const {UNSAFE_getByType} = renderComponent();
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();

    const renderOptions = AppModalService.modalsOpened[0];

    await waitFor(() => {
      expect(renderOptions).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBe('wm-dialog');
    });
  });

  test('should call onOk when OK button is pressed', async () => {
    // invokeEventCallback
    const invokeEventCallbackMock = jest.spyOn(
      WmConfirmdialog.prototype,
      'invokeEventCallback'
    );
    const dialogCloseMock = jest.spyOn(WmDialog.prototype, 'close');
    const {UNSAFE_getByType} = renderComponent();
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    fireEvent.press(subTree.getByText('Yes'));

    await waitFor(() => {
      expect(renderOptions).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBe('wm-dialog');
      expect(dialogCloseMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onOk',
        expect.arrayContaining([null])
      );
    });
  });

  test('should call onCancel when Cancel button is pressed', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmConfirmdialog.prototype,
      'invokeEventCallback'
    );
    const dialogCloseMock = jest.spyOn(WmDialog.prototype, 'close');
    const {UNSAFE_getByType} = renderComponent();
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    fireEvent.press(subTree.getByText('No'));

    await waitFor(() => {
      expect(renderOptions).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBe('wm-dialog');
      expect(dialogCloseMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalled();
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onCancel',
        expect.arrayContaining([null])
      );
    });
  });

  test('should render with custom icon', async () => {
    const {UNSAFE_getByType} = renderComponent({ iconclass: 'wm-sl-l sl-check' });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    await waitFor(() => {
      expect(renderOptions).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBeTruthy();
      expect(
        renderOptions.content.props.children.props.children.props.testID
      ).toBe('wm-dialog');
      expect(subTree.getByText('check')).toBeTruthy();
    });
  });

  test('should call onOpened when the dialog is opened', async () => {
    const {UNSAFE_getByType} = renderComponent();
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    // there is a setTimeout of 500ms in AppModalService showLastModal
    await timer(600);

    expect(defaultProps.onOpened).toHaveBeenCalled();
  });

  test('should render custom styles', async () => {
    const customStyles = {
      dialog: {
        root: {
          backgroundColor: 'blue',
        },
      },
      okButton: {
        backgroundColor: 'green',
      },
      cancelButton: {
        backgroundColor: 'red',
      },
      message: {
        color: 'purple',
      },
    };
    const {UNSAFE_getByType} = renderComponent({ styles: customStyles });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const { getByTestId, getByText } = render(<Content />);

    expect(getByTestId('wm-dialog').props.style).toMatchObject({
      backgroundColor: 'blue',
    });
    expect(getByText('Yes').props.style).toMatchObject({
      backgroundColor: 'green',
    });
    expect(getByText('No').props.style).toMatchObject({
      backgroundColor: 'red',
    });
    expect(
      getByText('Are you sure you want to delete this item?').props.style
    ).toMatchObject({ color: 'purple' });
  });

  test('should render with animation if animation prop is provided', async () => {
    const {UNSAFE_getByType} = renderComponent({ animation: 'bounce' });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    expect(renderOptions.animation).toBe('bounce');
  });

  test('should have modal property set as per prop value', async () => {
    const {UNSAFE_getByType} = renderComponent({ modal: false });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    expect(renderOptions.isModal).toBe(false);
  });

  test('should render icon using URL if iconurl prop is provided', async () => {
    const {UNSAFE_getByType} = renderComponent({
      iconurl: 'https://example.com/icon.png',
      iconwidth: 20,
      iconheight: 30,
    });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    await waitFor(() => {
      expect(subTree.getByTestId('confirm_dialog_icon_icon')).toBeTruthy();
      expect(
        subTree.getByTestId('confirm_dialog_icon_icon').props.source
      ).toMatchObject({ uri: 'https://example.com/icon.png' });
      expect(
        subTree.getByTestId('confirm_dialog_icon_icon').props.style
      ).toMatchObject({
        height: 30,
        width: 20,
      });
    });
  });

  test('should set the default message if not provided', async () => {
    const {UNSAFE_getByType} = renderComponent();
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const { getByText } = render(<Content />);

    expect(getByText('I am confirm box!')).toBeTruthy();
  });

  test('should render message when provided', async () => {
    const {UNSAFE_getByType} = renderComponent({ message: 'test message' });
    const instance = UNSAFE_getByType(WmConfirmdialog).instance;
    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const { getByText } = render(<Content />);

    expect(getByText('test message')).toBeTruthy();
  });

  test('should open and close the dialog using open and close methods', async () => {
    const component = renderComponent();
    const instance = component.UNSAFE_getByType(WmConfirmdialog).instance;

    instance.open();
    await timer();
    const renderOptions = AppModalService.modalsOpened[0];

    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const tree = render(<Content />);

    expect(tree.getByTestId('wm-dialog')).toBeTruthy();

    instance.close();
    await timer();

    expect(AppModalService.modalsOpened[0]).toBeUndefined();
  });
});
