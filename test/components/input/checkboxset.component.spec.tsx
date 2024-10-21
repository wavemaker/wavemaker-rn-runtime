import React, { ReactNode, createRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmCheckboxset from '@wavemaker/app-rn-runtime/components/input/checkboxset/checkboxset.component';
import WmCheckboxsetProps from '@wavemaker/app-rn-runtime/components/input/checkboxset/checkboxset.props';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

describe('WmCheckboxset', () => {
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
    WmCheckboxset.prototype,
    'invokeEventCallback'
  );

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmCheckboxset {...defaultProps} groupby="group" />);
    expect(screen.getByText('name0')).toBeTruthy();
    expect(screen.getByText('name1')).toBeTruthy();
    expect(screen.getByText('name2')).toBeTruthy();
  });

  // Item Selection
  it('selects and deselects items correctly', async () => {
    render(<WmCheckboxset {...defaultProps} />);
    const option1 = screen.getByText('name1');
    fireEvent.press(option1);
    const option1Checkbox = screen.getByLabelText('Checkbox for name1');
    expect(option1Checkbox).toHaveProperty(
      'props.accessibilityState.checked',
      true
    );
    fireEvent.press(option1);
    await waitFor(() => {
      expect(option1Checkbox).toHaveProperty(
        'props.accessibilityState.checked',
        false
      );
    });
  });

  // Group By Functionality
  it('renders grouped data correctly', () => {
    render(<WmCheckboxset {...defaultProps} groupby="group" />);
    expect(screen.getByText('g1')).toBeTruthy();
    expect(screen.getByText('g2')).toBeTruthy();
    expect(screen.getByText('name0')).toBeTruthy();
    expect(screen.getByText('name1')).toBeTruthy();
    expect(screen.getByText('name2')).toBeTruthy();
  });

  it('renders orderby correctly', () => {
    render(<WmCheckboxset {...defaultProps} orderby="name:desc" />);
    const items = screen.UNSAFE_getAllByType(Text);
    expect(items[1].props.children).toBe('name2');
    expect(items[3].props.children).toBe('name1');
    expect(items[5].props.children).toBe('name0');
  });

  // Accessibility Props
  it('applies accessibility props correctly', () => {
    render(<WmCheckboxset {...defaultProps} hint="wm-checkboxset" />);
    expect(screen.getByLabelText('Checkbox for name0')).toBeTruthy();
    expect(screen.getByLabelText('Checkbox for name1')).toBeTruthy();
    expect(screen.getByLabelText('Checkbox for name2')).toBeTruthy();
    expect(screen.getAllByA11yHint('wm-checkboxset')).toBeTruthy();
  });

  // Validation and Event Handling
  it('handles onTap and onChange event correctly', async () => {
    render(<WmCheckboxset {...defaultProps} datavalue="name0" />);
    const option1 = screen.getByText('name1');
    fireEvent.press(option1);
    const onPressMock = jest.spyOn(WmCheckboxset.prototype, 'onPress');

    const option1Checkbox = screen.getByLabelText('Checkbox for name1');
    expect(option1Checkbox).toHaveProperty(
      'props.accessibilityState.checked',
      true
    );
    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(2);
    });
    expect(invokeEventCallbackMock.mock.calls[0][0]).toBe('onTap');
    expect(invokeEventCallbackMock.mock.calls[1][0]).toBe('onChange');
    expect(invokeEventCallbackMock.mock.calls[1][1][2].toString()).toBe(
      ['name0', 'name1'].toString()
    );
    expect(invokeEventCallbackMock.mock.calls[1][1][3]).toBe('name0');
    expect(invokeEventCallbackMock.mock.calls[1][1][1]).toBeInstanceOf(
      WmCheckboxset
    );
  });

  // Edge Cases: Empty Dataset
  it('handles empty dataset gracefully', () => {
    const props = { ...defaultProps, dataset: [] };
    render(<WmCheckboxset {...props} />);
    expect(screen.queryByText('name1')).toBeNull();
    expect(screen.queryByText('name0')).toBeNull();
  });

  // Custom Render Item Partial
  xit('renders custom item partial correctly', async () => {
    const renderItemPartial = jest
      .fn()
      .mockReturnValue(<Text>Custom Partial</Text>);
    const props = {
      ...defaultProps,
      renderitempartial: renderItemPartial,
      template: 'custom-template',
    };
    render(<WmCheckboxset {...props} />);
    await waitFor(() => {
      expect(screen.getByText('Custom Partial')).toBeTruthy();
    });
  });

  // Handling multiple columns
  it('handles multiple columns correctly', () => {
    const props = { ...defaultProps, itemsperrow: { xs: 2 } };
    render(<WmCheckboxset {...props} />);
    expect(screen).toMatchSnapshot();

    const option1 = screen.getByLabelText('Checkbox for name1');
    expect(option1).toHaveProperty('props.style.width', '50%'); // Each column should take up 50% width if itemsperrow is 2
  });

  // Ensure setTemplate method works correctly
  it('handles setTemplate correctly', () => {
    const instance = new WmCheckboxset(defaultProps);
    instance.setTemplate('custom-template');
    expect(instance.state.template).toBe('custom-template');
  });

  // Ensure datavalue updates correctly
  // it('updates datavalue correctly', async () => {
  //   const instance = new WmCheckboxset(defaultProps);
  //   // const ref = createRef();
  //   // render(<WmCheckboxset {...defaultProps} ref={ref} />);
  //   // ref.current.updateDatavalue(['1', '2']);

  //   instance.updateDatavalue(['1', '2']);
  //   await waitFor(() => {
  //     expect(instance.state.props.datavalue).toEqual(['1', '2']);
  //   });
  // });

  // Error State Handling
  it('handles validation errors correctly', () => {
    const ref = createRef();
    const validateSpy = jest.spyOn(WmCheckboxset.prototype, 'validate');
    const props = { ...defaultProps, required: true };
    render(<WmCheckboxset {...props} ref={ref} />);
    const option1 = screen.getByLabelText('Checkbox for name1');

    fireEvent.press(option1); // Add selection
    expect(validateSpy).toHaveBeenCalledWith(['name1']);
    expect(ref.current.state.isValid).toBe(true);
  });

  // Check for unique data items
  it('handles unique data items correctly', () => {
    const dataset = 'Option 1, Option 2, Option 1';
    const props = { ...defaultProps, dataset: dataset };
    render(<WmCheckboxset {...props} />);
    expect(screen.getAllByText('Option 1').length).toBe(1);
  });

  // Readonly and Disabled States
  it('handles readonly and disabled states correctly', async () => {
    const props = { ...defaultProps, disabled: true, datavalue: 'name1' };
    render(<WmCheckboxset {...props} />);
    const option1Checkbox = screen.getByLabelText('Checkbox for name1');
    fireEvent.press(option1Checkbox);
    await waitFor(() => {
      expect(option1Checkbox).toHaveProperty(
        'props.accessibilityState.checked',
        true
      );
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(0);
    });

    const propsReadonly = {
      ...defaultProps,
      readonly: true,
      datavalue: 'name2',
    };
    render(<WmCheckboxset {...propsReadonly} />);
    const option2Checkbox = screen.getByLabelText('Checkbox for name2');
    fireEvent.press(option2Checkbox);
    await waitFor(() => {
      expect(option2Checkbox).toHaveProperty(
        'props.accessibilityState.checked',
        true
      );
      expect(invokeEventCallbackMock).toHaveBeenCalledTimes(0);
    });
  });

  // Handling different dataset formats
  it('handles different dataset formats correctly', () => {
    const stringDataset = 'Option 1, Option 2, Option 3';
    const arrayDataset = ['Option 1', 'Option 2', 'Option 3'];

    const propsStringDataset = { ...defaultProps, dataset: stringDataset };
    render(<WmCheckboxset {...propsStringDataset} />);
    expect(screen.getByText('Option 3')).toBeTruthy();

    const propsArrayDataset = { ...defaultProps, dataset: arrayDataset };
    render(<WmCheckboxset {...propsArrayDataset} />);
    expect(screen.getByText('Option 3')).toBeTruthy();
  });
});
