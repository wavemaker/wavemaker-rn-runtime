import React, { ReactNode, createRef } from 'react';
import WmSwitch from '@wavemaker/app-rn-runtime/components/input/switch/switch.component';

import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import WmSwitchProps from '../../../src/components/input/switch/switch.props';
import { Tappable } from '../../../src/core/tappable.component';

// Mock React Native components and WmIcon
// jest.mock('react-native', () => ({
//   Text: 'Text',
//   View: 'View',
// }));
// jest.mock('@wavemaker/app-rn-runtime/components/basic/icon/icon.component', () => 'WmIcon');
// jest.mock('@wavemaker/app-rn-runtime/core/tappable.component', () => ({
//   Tappable: ({ children, onTap }) => (<div onClick={onTap} data-testid="tappable-item">{children}</div>),
// }));

describe('WmSwitch', () => {
  const mockDataset = [
    {
      key: '1',
      displayfield: 'Yes',
      datafield: 'yes',
      iconclass: 'fa fa-check',
    },
    { key: '2', displayfield: 'No', datafield: 'no', iconclass: 'fa fa-edit' },
    {
      key: '3',
      displayfield: 'Maybe',
      datafield: 'maybe',
      iconclass: 'fa fa-anchor',
    },
  ];

  let defaultProps: WmSwitchProps;

  beforeEach(() => {
    defaultProps = new WmSwitchProps();
    defaultProps.dataset = mockDataset;
    defaultProps.datavalue = 'yes';
    defaultProps.datafield = 'datafield';
    defaultProps.displayfield = 'displayfield';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmSwitch />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByText('yes')).toBeTruthy();
    expect(screen.getByText('no')).toBeTruthy();
    expect(screen.getByText('maybe')).toBeTruthy();
  });

  // Dataset Handling
  it('handles dataset properly and renders items based on it', async () => {
    render(<WmSwitch {...defaultProps} />);
    const items = screen.UNSAFE_queryAllByType(Tappable);
    expect(items.length).toBe(3);
    items.forEach((item, index) => {
      expect(screen.getByText(mockDataset[index].displayfield)).toBeTruthy();
    });
    // await waitFor(() => {
    //   expect(screen.getByText('Yes')).toBeTruthy();
    //   expect(screen.getByText('No')).toBeTruthy();
    //   expect(screen.getByText('Maybe')).toBeTruthy();
    // });
  });

  // Data Value Change
  it('responds to changes in datavalue prop and sets selected item correctly', () => {
    const ref = createRef();
    const { rerender } = render(<WmSwitch {...defaultProps} ref={ref} />);

    rerender(<WmSwitch {...defaultProps} datavalue="no" ref={ref} />);
    // const items = screen.UNSAFE_getAllByType(Tappable);
    const items = screen.root.children;
    expect(items[1].props.styles).toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(<WmSwitch {...defaultProps} hint="wm-switch" />);
    const items = screen.getAllByA11yHint('wm-switch');

    // expect(screen.getAllByA11yHint('wm-switch')).toBeTruthy();
    expect(items[0].props.accessibilityState.selected).toBe(true);
    expect(items[1].props.accessibilityState.selected).toBe(false);
    expect(items[2].props.accessibilityState.selected).toBe(false);
  });

  // Interaction Handling (onTap and onChange)
  it('handles onTap and onChange correctly', async () => {
    const ref = createRef();
    render(<WmSwitch {...defaultProps} ref={ref} />);
    const textItem = screen.getByText('No');
    const invokeEventCallbackMock = jest.spyOn(
      WmSwitch.prototype,
      'invokeEventCallback'
    );
    const onChangeMock = jest.spyOn(WmSwitch.prototype, 'onChange');
    const items = screen.root.children;
    fireEvent(textItem, 'press');

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith('no');
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(2);
    });
    expect(items[1].props.styles).toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
  });

  // Handle icon rendering for an item
  it('renders icon if iconclass prop is provided', () => {
    const propsWithIconClass = { ...defaultProps, iconclass: 'iconclass' };
    render(<WmSwitch {...propsWithIconClass} />);
    expect(screen.getByText('check')).toBeTruthy();
    expect(screen.getByText('edit')).toBeTruthy();
    expect(screen.getByText('anchor')).toBeTruthy();
  });

  // Disabled State
  it('does not handle taps when disabled', async () => {
    const ref = createRef();
    render(<WmSwitch {...defaultProps} disabled={true} ref={ref} />);
    const textItem = screen.getByText('No');
    const items = screen.root.children;
    const invokeEventCallbackMock = jest.spyOn(
      WmSwitch.prototype,
      'invokeEventCallback'
    );
    const onChangeMock = jest.spyOn(WmSwitch.prototype, 'onChange');
    fireEvent(textItem, 'press');

    await waitFor(() => {
      expect(onChangeMock).not.toHaveBeenCalledWith('no');
      expect(invokeEventCallbackMock).not.toHaveBeenCalled();
    });
    expect(items[1].props.styles).not.toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
  });

  // Dynamic Dataset Update
  it('processes updates to the dataset prop correctly', async () => {
    const { rerender } = render(<WmSwitch {...defaultProps} />);
    const newDataset = [
      { key: '1', displayfield: 'One', datafield: 'one' },
      { key: '2', displayfield: 'Two', datafield: 'two' },
    ];
    rerender(<WmSwitch {...defaultProps} dataset={newDataset} />);
    let items;
    await waitFor(() => {
      items = screen.UNSAFE_queryAllByType(Tappable);
      expect(items.length).toBe(2);
    });
    items.forEach((item, index) => {
      expect(screen.getByText(newDataset[index].displayfield)).toBeTruthy();
    });
  });

  it('renders correctly when datafield = "All Fields"', async () => {
    const ref = createRef();
    render(<WmSwitch {...defaultProps} datafield="All Fields" ref={ref} />);
    const textItem = screen.getByText('No');
    const invokeEventCallbackMock = jest.spyOn(
      WmSwitch.prototype,
      'invokeEventCallback'
    );
    const onChangeMock = jest.spyOn(WmSwitch.prototype, 'onChange');
    const items = screen.root.children;
    fireEvent(textItem, 'press');

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith('null_item1');
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(2);
    });
    expect(items[1].props.styles).toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
  });

  it('should not change anything when same item is clicked', async () => {
    const ref = createRef();
    render(<WmSwitch {...defaultProps} ref={ref} />);
    const textItem = screen.getByText('Yes');
    const invokeEventCallbackMock = jest.spyOn(
      WmSwitch.prototype,
      'invokeEventCallback'
    );
    const onChangeMock = jest.spyOn(WmSwitch.prototype, 'onChange');
    const items = screen.root.children;
    // pressing 1st time

    fireEvent(textItem, 'press');

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith('yes');
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(1);
    });
    expect(items[0].props.styles).toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
    // pressing 2nd time
    fireEvent(textItem, 'press');

    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledWith('yes');
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(1);
    });
    expect(items[0].props.styles).toContainEqual(
      expect.objectContaining({
        backgroundColor: ref.current.styles.selectedButton.backgroundColor,
      })
    );
  });
});
