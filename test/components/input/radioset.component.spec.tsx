import React, { ReactNode, createRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmRadioset from '@wavemaker/app-rn-runtime/components/input/radioset/radioset.component';
import WmRadiosetProps from '@wavemaker/app-rn-runtime/components/input/radioset/radioset.props';

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('WmRadioset', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      dataset: [
        {
          name: 'name0',
          dataValue: 'dataValue0',
          group: 'g1',
        },
        {
          name: 'name2',
          dataValue: 'dataValue2',
          group: 'g1',
        },
        {
          name: 'name1',
          dataValue: 'dataValue1',
          group: 'g2',
        },
      ],
      displayfield: 'name',
      datafield: 'name',
    };
    // defaultProps.itemsperrow = { xs: 1 };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const invokeEventCallbackMock = jest.spyOn(
    WmRadioset.prototype,
    'invokeEventCallback'
  );

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmRadioset {...defaultProps} groupby="group" datavalue="name1" />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByText('name0')).toBeTruthy();
    expect(screen.getByText('name1')).toBeTruthy();
    expect(screen.getByText('name2')).toBeTruthy();
  });

  // Item Selection
  it('selects items correctly', async () => {
    const ref = createRef();
    render(<WmRadioset {...defaultProps} ref={ref} />);
    const option1 = screen.getByText('name1');
    const option2 = screen.getByText('name2');
    fireEvent.press(option1);
    expect(ref.current.state.dataItems[2].selected).toBe(true);
    fireEvent.press(option2);
    expect(ref.current.state.dataItems[1].selected).toBe(true);
  });

  // Group By Functionality
  it('renders grouped data correctly', () => {
    render(<WmRadioset {...defaultProps} groupby="group" />);
    expect(screen.getByText('g1')).toBeTruthy();
    expect(screen.getByText('g2')).toBeTruthy();
    expect(screen.getByText('name0')).toBeTruthy();
    expect(screen.getByText('name1')).toBeTruthy();
    expect(screen.getByText('name2')).toBeTruthy();
  });

  it('renders orderby correctly', () => {
    render(<WmRadioset {...defaultProps} orderby="name:desc" />);
    const items = screen.UNSAFE_getAllByType(Text);
    expect(items[1].props.children).toBe('name2');
    expect(items[3].props.children).toBe('name1');
    expect(items[5].props.children).toBe('name0');
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(<WmRadioset {...defaultProps} />);
    expect(screen.getByLabelText('Radio button for name0')).toBeTruthy();
    expect(screen.getByLabelText('Radio button for name1')).toBeTruthy();
    expect(screen.getByLabelText('Radio button for name2')).toBeTruthy();
  });

  // Validation and Event Handling
  it('handles onTap and onChange event correctly', async () => {
    render(<WmRadioset {...defaultProps} datavalue="name0" />);
    const option1 = screen.getByText('name1');
    fireEvent.press(option1);

    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(2);
    });
    expect(invokeEventCallbackMock.mock.calls[0][0]).toBe('onTap');
    expect(invokeEventCallbackMock.mock.calls[1][0]).toBe('onChange');
    expect(invokeEventCallbackMock.mock.calls[1][1][2].toString()).toBe(
      'name1'
    );
    expect(invokeEventCallbackMock.mock.calls[1][1][3]).toBe('name0');
    expect(invokeEventCallbackMock.mock.calls[1][1][1]).toBeInstanceOf(
      WmRadioset
    );
  });

  // Edge Cases: Empty Dataset
  it('handles empty dataset gracefully', () => {
    const props = { ...defaultProps, dataset: [] };
    render(<WmRadioset {...props} />);
    expect(screen.queryByText('name1')).toBeNull();
    expect(screen.queryByText('name0')).toBeNull();
  });

  // Custom Render Item Partial
  it('renders custom item partial correctly', async () => {
    const ref = createRef();
    const renderItemPartial = jest
      .fn()
      .mockReturnValue(<Text>Custom Partial</Text>);
    const props = {
      ...defaultProps,
      renderitempartial: renderItemPartial,
      ref,
    };
    render(<WmRadioset {...props} />);
    ref.current.setTemplate(<Text>Custom Partial</Text>);

    await timer();
    expect(renderItemPartial).toHaveBeenCalled();
    expect(screen.getAllByText('Custom Partial')).toBeTruthy();
  });

  // Handling multiple columns
  it('handles multiple columns correctly', () => {
    const props = { ...defaultProps, itemsperrow: { xs: 2 } };
    render(<WmRadioset {...props} />);

    const option1 = screen.UNSAFE_getAllByType(TouchableOpacity)[0];
    expect(option1).toHaveProperty('props.style[2].width', '50%'); // Each column should take up 50% width if itemsperrow is 2
  });

  // Ensure setTemplate method works correctly
  it('handles setTemplate correctly', () => {
    const instance = new WmRadioset(defaultProps);
    instance.setTemplate('custom-template');
    expect(instance.state.template).toBe('custom-template');
  });

  // Error State Handling
  it('handles validation errors correctly', () => {
    const ref = createRef();
    const validateSpy = jest.spyOn(WmRadioset.prototype, 'validate');
    const props = { ...defaultProps, required: true };
    render(<WmRadioset {...props} ref={ref} />);
    const option1 = screen.getByLabelText('Radio button for name1');

    fireEvent.press(option1); // Add selection
    expect(validateSpy).toHaveBeenCalledWith('name1');
    expect(ref.current.state.isValid).toBe(true);
  });

  // Check for unique data items
  it('handles unique data items correctly', () => {
    const dataset = 'Option 1, Option 2, Option 1';
    const props = { ...defaultProps, dataset: dataset };
    render(<WmRadioset {...props} />);
    expect(screen.getAllByText('Option 1').length).toBe(1);
  });

  // Readonly and Disabled States
  it('handles readonly and disabled states correctly', async () => {
    const ref = createRef();
    const props = { ...defaultProps, disabled: true, ref };
    render(<WmRadioset {...props} />);
    const option1Radiobutton = screen.getByText('name1');
    fireEvent.press(option1Radiobutton);
    expect(ref.current.state.dataItems[2].selected).toBe(false);
    expect(invokeEventCallbackMock).toBeCalledTimes(0);

    const propsReadonly = {
      ...defaultProps,
      readonly: true,
    };
    render(<WmRadioset {...propsReadonly} />);
    const option2Radiobutton = screen.getByText('name2');
    fireEvent.press(option2Radiobutton);
    expect(ref.current.state.dataItems[1].selected).toBe(false);
    expect(invokeEventCallbackMock).toBeCalledTimes(0);
  });

  // Handling different dataset formats
  it('handles different dataset formats correctly', () => {
    const stringDataset = 'Option 1, Option 2, Option 3';
    const arrayDataset = ['Option 1', 'Option 2', 'Option 3'];

    const propsStringDataset = { ...defaultProps, dataset: stringDataset };
    render(<WmRadioset {...propsStringDataset} />);
    expect(screen.getByText('Option 3')).toBeTruthy();

    const propsArrayDataset = { ...defaultProps, dataset: arrayDataset };
    render(<WmRadioset {...propsArrayDataset} />);
    expect(screen.getByText('Option 3')).toBeTruthy();
  });
});
