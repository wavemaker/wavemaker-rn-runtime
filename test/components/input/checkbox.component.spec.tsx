import React, { ReactNode, createRef } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import WmCheckbox from '@wavemaker/app-rn-runtime/components/input/checkbox/checkbox.component';
import WmCheckboxProps from '@wavemaker/app-rn-runtime/components/input/checkbox/checkbox.props';
import { View } from 'react-native';

// jest.mock(
//   '@wavemaker/app-rn-runtime/components/basic/icon/icon.component',
//   () => 'WmIcon'
// );

describe('WmCheckbox Unit tests', () => {
  let defaultProps: WmCheckboxProps;

  beforeEach(() => {
    defaultProps = new WmCheckboxProps();
    defaultProps.caption = 'Test Checkbox';
    // defaultProps.datavalue = false;
    defaultProps.checkedvalue = 'yes';
    defaultProps.uncheckedvalue = 'no';
    // defaultProps.readonly = false;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Check Rendering with Default Props
  it('renders correctly with default props', () => {
    render(<WmCheckbox {...defaultProps} />);
    expect(screen).toMatchSnapshot();
    expect(screen.getByText('Test Checkbox')).toBeTruthy();
  });

  // Checked and Unchecked Value Handling
  it('handles checked and unchecked values correctly', async () => {
    const { rerender } = render(
      <WmCheckbox {...defaultProps} datavalue="yes" />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.props.accessibilityState.checked).toBe(true);

    rerender(<WmCheckbox {...defaultProps} datavalue="no" />);
    await waitFor(() => {
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });
  });

  // Disabled and Readonly Handling
  xit('does not respond to press events when disabled', async () => {
    render(<WmCheckbox {...defaultProps} disabled={true} />);
    const checkbox = screen.getByRole('checkbox');
    const invokeEventCallbackMock = jest.spyOn(
      WmCheckbox.prototype,
      'invokeEventCallback'
    );
    fireEvent.press(checkbox);
    await waitFor(() => {
      expect(checkbox.props.accessibilityState.checked).not.toBe(true);
      expect(invokeEventCallbackMock).not.toHaveBeenCalled();
      expect(checkbox.props.accessibilityState.disabled).toBe(true);
    });
  });

  it('does not respond to press events when readonly', async () => {
    render(<WmCheckbox {...defaultProps} readonly={true} datavalue="yes" />);
    const invokeEventCallback = jest.spyOn(
      WmCheckbox.prototype,
      'invokeEventCallback'
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.press(checkbox);
    await waitFor(() => {});
    expect(checkbox.props.accessibilityState.checked).toBe(true);
    expect(invokeEventCallback).not.toHaveBeenCalledWith('onFocus', [
      null,
      expect.anything(),
    ]);
  });

  // Accessibility Props
  xit('applies accessibility props correctly', () => {
    render(
      <WmCheckbox
        {...defaultProps}
        disabled={false}
        datavalue="yes"
        hint="wm-checkbox"
      />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(screen.getByLabelText('Checkbox for Test Checkbox')).toBeTruthy();
    expect(checkbox).toBeTruthy();
    expect(screen.getByA11yHint('wm-checkbox')).toBeTruthy();
    expect(checkbox.props.accessibilityState.checked).toBe(true);
    expect(checkbox.props.accessibilityState.disabled).toBe(false);
  });

  // Validation
  it('validates correctly using validateField utility', async () => {
    const validateMock = jest.spyOn(WmCheckbox.prototype, 'validate');
    const updateStateMock = jest.spyOn(WmCheckbox.prototype, 'updateState');
    render(<WmCheckbox {...defaultProps} required={true} datavalue="no" />);
    fireEvent.press(screen.getByRole('checkbox'));
    await waitFor(() => {
      expect(validateMock).toHaveBeenCalled();
      expect(updateStateMock).toHaveBeenCalledWith({
        isValid: true,
        errorType: undefined,
      });
    });
  });

  // User Interaction (onPress)
  it('handles onPress event correctly', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmCheckbox.prototype,
      'invokeEventCallback'
    );
    const updateStateMock = jest.spyOn(WmCheckbox.prototype, 'updateState');
    const props = {
      ...defaultProps,
      datavalue: 'no',
    };
    render(<WmCheckbox {...props} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.press(checkbox);

    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalledWith('onBlur', [
        null,
        expect.anything(),
      ]);
      expect(updateStateMock).toHaveBeenCalledWith({ isChecked: true });
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onChange', [
      null,
      expect.anything(),
      'yes',
      'no',
    ]);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onTap', [
      null,
      expect.anything(),
    ]);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onFocus', [
      null,
      expect.anything(),
    ]);
  });

  // Icon and Text Rendering
  it('renders icon and text correctly', () => {
    render(<WmCheckbox {...defaultProps} />);

    expect(screen.getByText('Test Checkbox')).toBeTruthy();
    expect(screen.getByText('check')).toBeTruthy();
  });

  // Disabled State Styles
  it('applies correct styles when disabled', () => {
    render(<WmCheckbox {...defaultProps} disabled={true} />);
    const checkbox = screen.getByRole('checkbox');
    // Check if disabled styles are applied correctly
    expect(checkbox.props.style).toMatchObject({ opacity: 0.8 });
  });

  // Initialization and State
  it('sets initial state correctly based on datavalue', () => {
    const ref = createRef();
    const { getByRole } = render(
      <WmCheckbox {...defaultProps} datavalue="yes" ref={ref} />
    );
    const checkbox = getByRole('checkbox');
    expect(ref.current.state.isChecked).toBe(true);
  });

  // Internal Methods
  it('calls internal methods correctly', async () => {
    const ref = createRef();
    const onFieldChange = jest.fn();
    render(
      <WmCheckbox
        {...defaultProps}
        ref={ref}
        onFieldChange={onFieldChange}
        datavalue="no"
      />
    );
    const setCheckedMock = jest.spyOn(WmCheckbox.prototype, 'setChecked');
    const updateStateMock = jest.spyOn(WmCheckbox.prototype, 'updateState');

    fireEvent.press(screen.getByRole('checkbox'));

    await waitFor(() => {
      expect(setCheckedMock).toHaveBeenCalled();
      expect(onFieldChange).toHaveBeenCalledWith('datavalue', 'yes', 'no');
    });
    expect(ref.current.state.isChecked).toBe(true);

    fireEvent.press(screen.getByRole('checkbox'));

    await waitFor(() => {
      expect(setCheckedMock).toHaveBeenCalled();
      expect(ref.current.state.isChecked).toBe(false);
    });

    ref.current.updateDatavalue(true);
    expect(updateStateMock).toHaveBeenCalledWith({
      props: { datavalue: true },
    });
  });

  //skeleton loader
  it('should render skeleton with respect to showskeletonwidth and showskeletonheight when show skeleton is true', async() => {
    const renderSkeletonMock = jest.spyOn(WmCheckbox.prototype, 'renderSkeleton');
    const {UNSAFE_getAllByType} = render(<WmCheckbox {...defaultProps} showskeleton={true} skeletonwidth='100' skeletonheight='50' />)
    expect(renderSkeletonMock).toHaveBeenCalledTimes(1);
    const views = UNSAFE_getAllByType(View);
    expect(views[1].props.style.borderRadius).toBe(4);
    expect(views[1].props.style.backgroundColor).toBe("#eeeeee");
    expect(views[1].props.style.width).toBe('100');
    expect(views[1].props.style.height).toBe('50');
    expect(views[2].props.style.borderRadius).toBe(4);
    expect(views[2].props.style.backgroundColor).toBe("#eeeeee");
    expect(views[2].props.style.width).toBe('100');
    expect(views[2].props.style.height).toBe('50');
  })

  it('should render skeleton with respect to provided styles when show skeleton is true', () => {
    const {UNSAFE_getAllByType} = render(<WmCheckbox {...defaultProps} showskeleton={true}/>)
    const views = UNSAFE_getAllByType(View);
    expect(screen).toMatchSnapshot();
    expect(views[1].props.style.borderRadius).toBe(4);
    expect(views[1].props.style.backgroundColor).toBe("#eeeeee");
    expect(views[1].props.style.width).toBe(20);
    expect(views[1].props.style.height).toBe(20);
    expect(views[2].props.style.borderRadius).toBe(4);
    expect(views[2].props.style.backgroundColor).toBe("#eeeeee");
    expect(views[2].props.style.width).toBe(100);
    expect(views[2].props.style.height).toBe(16);
  })
});
