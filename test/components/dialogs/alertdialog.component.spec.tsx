import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import WmAlertdialog from '@wavemaker/app-rn-runtime/components/dialogs/alertdialog/alertdialog.component';
import WmDialog from '@wavemaker/app-rn-runtime/components/dialogs/dialog/dialog.component';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

const defaultProps = {
  id: 'alert',
  title: 'Alert',
  oktext: 'Ok',
  modal: true,
  closable: true,
  onOpened: jest.fn(),
};

const renderComponent = async (props = {}) => {
  const loadAsset = (path) => path;
  AppModalService.modalsOpened = [];

  const tree = render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmAlertdialog {...defaultProps} {...props} />
      </AssetProvider>
    </ModalProvider>
  );

  const instance = tree.UNSAFE_getByType(WmAlertdialog).instance;
  instance.open();
  await timer();

  return tree;
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const Component = ({ children }) => <>{children}</>;

describe('Alertdialog component', () => {
  afterEach(() => {
    cleanup();
  });

  test('should render WmAlertdialog with default props', async () => {
    await renderComponent({ message: 'test alert message' });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByTestId('wm-dialog')).toBeDefined();
    expect(subTree.getByTestId('wm-dialog-header')).toBeDefined();
    expect(subTree.getByText('test alert message')).toBeDefined();
    expect(subTree.getByText('warning')).toBeDefined(); // default icon class: wi wi-warning
  });

  test('should render custom ok button text', async () => {
    await renderComponent({ oktext: 'test ok button' });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByText('test ok button')).toBeDefined();
  });

  test('should render custom title', async () => {
    await renderComponent({ title: 'test title' });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByText('test title')).toBeDefined();
  });

  test('should render with custom icon', async () => {
    await renderComponent({ iconclass: 'wi wi-test_help' });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByText('test_help')).toBeDefined();
  });

  test('should call onOpened when the dialog is opened', async () => {
    await renderComponent();
    await timer(600);

    expect(defaultProps.onOpened).toHaveBeenCalled();
  });

  test('should be closable when closable prop is true', async () => {
    await renderComponent({ closable: true });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByText('close')).toBeDefined();
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
      message: {
        color: 'purple',
      },
    };
    await renderComponent({ styles: { customStyles } });
    const renderOptions = AppModalService.modalsOpened[0];
    const { getByTestId, getByText } = render(
      <Component children={renderOptions.content} />
    );

    expect(getByTestId('wm-dialog').props.style).toMatchObject({
      backgroundColor: 'blue',
    });
    expect(getByText('Ok').props.style).toMatchObject({
      backgroundColor: 'green',
    });
    expect(getByText('This is an alert message!').props.style).toMatchObject({
      color: 'purple',
    });
  });

  test('should render with animation if animation prop is provided', async () => {
    await renderComponent({ animation: 'fadeIn' });
    const renderOptions = AppModalService.modalsOpened[0];

    expect(renderOptions.animation).toBe('fadeIn');
  });

  test('should have modal property set as per prop value', async () => {
    await renderComponent({ modal: false });
    const renderOptions = AppModalService.modalsOpened[0];

    expect(renderOptions.isModal).toBe(false);
  });

  test('should render icon using URL if iconurl prop is provided', async () => {
    const iconurlProps = {
      iconurl: 'https://example.com/icon.png',
      iconwidth: 20,
      iconheight: 30,
    };
    await renderComponent({ ...iconurlProps });
    const renderOptions = AppModalService.modalsOpened[0];
    const subTree = render(<Component children={renderOptions.content} />);

    expect(subTree.getByTestId('alert_dialog_icon_icon')).toBeTruthy();
    expect(
      subTree.getByTestId('alert_dialog_icon_icon').props.source
    ).toMatchObject({ uri: 'https://example.com/icon.png' });
    expect(
      subTree.getByTestId('alert_dialog_icon_icon').props.style
    ).toMatchObject({
      height: 30,
      width: 20,
    });
  });

  test('should set the default message if not provided', async () => {
    await renderComponent();
    const renderOptions = AppModalService.modalsOpened[0];
    const { getByText } = render(
      <Component children={renderOptions.content} />
    );

    expect(getByText('I am an alert box!')).toBeDefined();
  });

  test('should close the dialog when close button is pressed', async () => {
    await renderComponent({ closable: true });
    const renderOptions = AppModalService.modalsOpened[0];
    const { getByText } = render(
      <Component children={renderOptions.content} />
    );

    expect(getByText('close')).toBeDefined();
    fireEvent(getByText('close'), 'press');

    await timer(500); // there is a timer in AppModalService

    expect(AppModalService.modalsOpened[0]).toBeUndefined();
  });

  test('should close dialog when ok button is pressed', async () => {
    const alertInvokeEventCallbackMock = jest.spyOn(
      WmAlertdialog.prototype,
      'invokeEventCallback'
    );
    const dialogInvokeEventCallbackMock = jest.spyOn(
      WmDialog.prototype,
      'invokeEventCallback'
    );
    await renderComponent();
    const renderOptions = AppModalService.modalsOpened[0];
    const { getByText } = render(
      <Component children={renderOptions.content} />
    );

    fireEvent(getByText('Ok'), 'press');
    await timer(500);

    expect(alertInvokeEventCallbackMock).toHaveBeenCalledWith(
      'onOk',
      expect.arrayContaining([null])
    );
    expect(dialogInvokeEventCallbackMock).toHaveBeenCalledWith(
      'onClose',
      expect.arrayContaining([null])
    );
    expect(AppModalService.modalsOpened[0]).toBeUndefined();
  });

  test('should open and close the dialog using open and close methods', async () => {
    const { UNSAFE_getByType } = render(
      <ModalProvider value={AppModalService}>
        <AssetProvider value={(path) => path}>
          <WmAlertdialog {...defaultProps} />
        </AssetProvider>
      </ModalProvider>
    );
    const instance = UNSAFE_getByType(WmAlertdialog).instance;
    instance.open();
    await timer();

    const subTree = render(
      <Component children={AppModalService.modalsOpened[0].content} />
    );

    expect(AppModalService.modalsOpened[0]).toBeDefined();
    expect(subTree.getByTestId('wm-dialog')).toBeDefined();

    instance.close();
    await timer();
    expect(AppModalService.modalsOpened[0]).toBeUndefined();
  });

  // TODO: update and use below test case when alerttype is being used in the alert dialog component.
  // test('should render alert message with correct style based on alerttype', () => {
  //   const { getByText } = renderComponent({alerttype: 'error'})

  //   expect(getByText('This is an alert message!').props.styles).toEqual({
  //     text: {
  //       color: '#ff0000', // Assuming the error text color
  //       // additional styles for error type
  //     },
  //   });

  //   const { getByText: getByTextInfo } = renderComponent({alerttype: 'information'})
  //   expect(getByTextInfo('This is an alert message!').props.styles).toEqual({
  //     text: {
  //       color: '#0000ff', // Assuming the info text color
  //       // additional styles for info type
  //     },
  //   });

  //   const { getByText: getByTextWarning } = renderComponent({alerttype: 'warning'})
  //   expect(getByTextWarning('This is an alert message!').props.styles).toEqual({
  //     text: {
  //       color: '#ffcc00', // Assuming the warning text color
  //       // additional styles for warning type
  //     },
  //   });

  //   const { getByText: getByTextSuccess } = renderComponent({alerttype: 'success'})
  //   expect(getByTextSuccess('This is an alert message!').props.styles).toEqual({
  //     text: {
  //       color: '#00ff00', // Assuming the success text color
  //       // additional styles for success type
  //     },
  //   });
  // });
});
