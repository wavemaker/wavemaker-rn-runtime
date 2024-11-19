import React, { ReactNode, createRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WmSelect from '@wavemaker/app-rn-runtime/components/input/select/select.component';
import WmSelectProps from '@wavemaker/app-rn-runtime/components/input/select/select.props';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react-native';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import * as AccessibilityConfig from '../../../src/core/accessibility';

import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';
import { create } from 'lodash-es';

const dataItems = [
  {
    name: 'name0',
    dataValue: 'dataValue0',
  },
  {
    name: 'name1',
    dataValue: 'dataValue1',
  },
  {
    name: 'name2',
    dataValue: 'dataValue2',
  },
];

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const loadAsset = (path: any) => path;

const defaultProps = {
  placeholder: 'Select an option',
  dataset: [
    {
      name: 'name0',
      dataValue: 'dataValue0',
    },
    {
      name: 'name1',
      dataValue: 'dataValue1',
    },
    {
      name: 'name2',
      dataValue: 'dataValue2',
    },
  ],
  datafield: 'name',
  displayfield: 'name',
};

AppModalService.modalsOpened = [];

function renderComponentWithWrappers(props = {}) {
  AppModalService.modalsOpened = [];

  return render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmSelect
          {...defaultProps}
          dataset={dataItems}
          datafield="name"
          displaylabel="name"
          {...props}
        />
      </AssetProvider>
    </ModalProvider>
  );
}

describe('WmSelect', () => {
  beforeEach(() => {
    jest
      .spyOn(AccessibilityConfig, 'isScreenReaderEnabled')
      .mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmSelect {...defaultProps} name="select1" />);
    expect(screen.getByText('Select an option')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  });

  // Disabled State
  it('does not allow selection when disabled', async () => {
    const tree = renderComponentWithWrappers({
      disabled: true,
      accessibilityrole: 'select',
    });
    const select = tree.getByText('Select an option');
    const selectParent = tree.getByRole('select');
    expect(selectParent.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(select);

    await timer(200);

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(subTree.queryByText('name0')).toBe(null);
  });

  // Event Handling
  it('handles onFocus and onBlur events', async () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const ref = createRef();
    const tree = renderComponentWithWrappers({
      onFocus: onFocusMock,
      onBlur: onBlurMock,
      ref,
    });
    const select = tree.getByText('Select an option');

    fireEvent.press(select);

    expect(onFocusMock).toHaveBeenCalled();

    await timer(200);

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    const cancel = subTree.getByText('name0');
    fireEvent.press(cancel);
    await timer(500);

    expect(onBlurMock).toHaveBeenCalled();
  });

  // Dataset Handling
  it('handles dataset properly and renders options based on it', async () => {
    const tree = renderComponentWithWrappers({ name: 'select1' });
    const select = tree.getByText('Select an option');
    fireEvent.press(select);

    await timer(200);

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(subTree.getByText('name0')).toBeTruthy();
    expect(subTree.getByText('name1')).toBeTruthy();
    expect(subTree.getByText('name2')).toBeTruthy();
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(
      <WmSelect
        {...defaultProps}
        accessibilitylabel="Select an option"
        hint="wm-select"
        accessibilityrole="select"
      />
    );

    expect(screen.getByLabelText('Select an option')).toBeTruthy();
    expect(screen.getByRole('select')).toBeTruthy();
    expect(screen.getAllByA11yHint('wm-select')).toBeTruthy();
  });

  //default value
  it('renders default value correctly', async () => {
    const tree = renderComponentWithWrappers({
      accessibilityrole: 'select',
      datavalue: 'name1',
    });

    const select = tree.getByText('name1');
    fireEvent.press(select);

    await timer(200);

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    expect(
      subTree.UNSAFE_getAllByType(WmIcon)[2].props.styles.root.opacity
    ).toBe(1);
  });

  // Item Selection
  it('selects item correctly and updates value', async () => {
    const ref = createRef();
    const onChangeEventMock = jest.fn();
    const tree = renderComponentWithWrappers({
      accessibilityrole: 'select',
      ref,
      onChange: onChangeEventMock,
    });
    const onChangefnMock = jest.spyOn(WmSelect.prototype, 'onChange');
    const select = tree.getByText('Select an option');
    const selectParent = tree.getByRole('select');

    fireEvent.press(select);

    await timer(200);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    AppModalService.animatedRefs = [
      {
        triggerExit: () => {},
      },
    ];
    const option = subTree.getByText('name0');

    fireEvent.press(option);

    await timer(1000);

    expect(onChangeEventMock).toHaveBeenCalled();
    expect(onChangefnMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText('name0')).toBeTruthy();
    });
  });

  // Error Handling
  it('handles validation and error states correctly', async () => {
    const triggerValidationMock = jest.fn();
    const ref = createRef();
    const validateMock = jest.spyOn(WmSelect.prototype, 'validate');
    // const validateMock = jest.spyOn(, 'validateField');
    const tree = renderComponentWithWrappers({
      triggerValidation: triggerValidationMock,
      datavalue: '',
      ref,
      required: true,
    });
    const select = screen.getByText('Select an option');
    fireEvent.press(select);

    await timer(200);

    const renderOptions = AppModalService.modalOptions; //[0];
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);
    renderOptions.onClose();
    await timer(200);

    expect(triggerValidationMock).toHaveBeenCalled();
    expect(validateMock).toHaveBeenCalled();
  });

  // show property
  it('handles show property correctly', async () => {
    const ref = createRef();
    const tree = render(
      <WmSelect
        {...defaultProps}
        accessibilitylabel="Select an option"
        show={true}
        ref={ref}
      />
    );

    await timer(100);
    expect(tree.root.props.children[1].props.style[0].width).not.toBe(0);
    expect(tree.root.props.children[1].props.style[0].height).not.toBe(0);

    ref.current.proxy.show = false;
    await timer(100);

    expect(tree.root.props.children[1].props.style[0].width).toBe(0);
    expect(tree.root.props.children[1].props.style[0].height).toBe(0);
  });

//skeleton loader
  it('should render skeleton with respect to root styles when show skeleton is true',  () => {
    const tree = render(<WmSelect {...defaultProps} showskeleton={true} />);
    expect(tree).toMatchSnapshot();
    const viewEles = tree.UNSAFE_getAllByType(View);
    expect(viewEles[2].props.style.width).toBe(100);
    expect(viewEles[2].props.style.height).toBe(16);
    expect(viewEles[3].props.style.width).toBe(24);
    expect(viewEles[3].props.style.height).toBe(24);
  })
});
