import React from 'react';
import {
  act,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import WmProgressBar from '@wavemaker/app-rn-runtime/components/basic/progress-bar/progress-bar.component';
import WmProgressBarProps from '@wavemaker/app-rn-runtime/components/basic/progress-bar/progress-bar.props';
import ThemeVariables from '../../../src/styles/theme.variables';
import Color from 'color';

describe('WmProgressBar Component', () => {
  const commonProps: WmProgressBarProps = {
    type: 'default',
    datavalue: 30,
    minvalue: 0,
    maxvalue: 100,
  };
  const themeVariables = new ThemeVariables();

  it('should render with default properties', () => {
    const tree = render(<WmProgressBar {...commonProps} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(tree.getByRole('progressbar')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('should render with different datavalue, minvalue, and maxvalue', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 40,
      minvalue: 0,
      maxvalue: 80,
    };

    let value =
      ((props.datavalue - props.minvalue) / (props.maxvalue - props.minvalue)) *
      100;

    const { getByRole } = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeTruthy();

    fireEvent(progressBar, 'layout', {nativeEvent : {
      layout: { width : 100}
    }})

    const animatedStyle = progressBar.props.children.props.children.props.style[1]
    const expectedValue = animatedStyle.transform[0].translateX._parent._value * 100 
    expect(expectedValue).toBe(value);

  });

  it('should render with style defined for the respective type', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      type: 'success',
    };
    const { getByRole } = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    const progressBar = getByRole('progressbar');

    expect(progressBar).toBeTruthy();
    const progressBarChildView = progressBar._fiber.stateNode.children[0];
    expect(progressBarChildView.props.style.backgroundColor).toBe(
      Color(themeVariables.progressBarSuccessColor).alpha(0.2).rgb().toString()
    );
  });

  xit('should render with accessibility properties', () => {
    const props = {
      ...commonProps,
      accessibilitylabel: 'Loading progress',
      hint: 'progressbar',
    };
    const { getByLabelText, getByRole, getByA11yHint } = render(
      <WmProgressBar {...props} />
    );
    act(() => {
      jest.runAllTimers();
    });
    const progressBar = getByLabelText('Loading progress');

    expect(progressBar).toBeTruthy();
    expect(getByRole('progressbar')).toBeTruthy();
    expect(getByLabelText(props.accessibilitylabel)).toBeTruthy();
    expect(getByA11yHint(props.hint)).toBeTruthy();
  });

  it('should render with given linear gradient background', () => {
    const props = {
      ...commonProps,
      styles: {
        root: {
          progressBar: {
            backgroundColor:
              'linear-gradient(90deg, rgba(255,0,0,1), rgba(0,0,255,1))',
          },
        },
      },
    };
    const tree = render(<WmProgressBar {...props} />);

    expect(tree.root.props.style.progressBar.backgroundColor).toBe(
      'linear-gradient(90deg, rgba(255,0,0,1), rgba(0,0,255,1))'
    );
  });

  it('should handle datavalue greater than maxvalue', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 110,
      maxvalue: 100,
    };
    const { getByRole } = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeTruthy();
  });

  it('should handle datavalue less than minvalue', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: -10,
      minvalue: 0,
    };
    const { getByRole } = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    const progressBar = getByRole('progressbar');
    expect(progressBar).toBeTruthy();
  });

  it('should trigger onTap callback with WmProgressBar instance as one of the arguments', async () => {
    const onTapMock = jest.fn();
    const tree = render(<WmProgressBar onTap={onTapMock} />);

    fireEvent(tree.getByRole('progressbar'), 'press');

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      const callArg = onTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressBar);
    });
  });

  it('should trigger onDoubleTap callback with WmProgressBar instance as one of the arguments', async () => {
    const onDoubleTapMock = jest.fn();
    const tree = render(<WmProgressBar onDoubletap={onDoubleTapMock} />);

    fireEvent(tree.getByRole('progressbar'), 'press');
    fireEvent(tree.getByRole('progressbar'), 'press');

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressBar);
    });
  });

  it('should trigger onLongTap callback with WmProgressBar instance as one of the arguments', async () => {
    const onLongTapMock = jest.fn();
    const tree = render(<WmProgressBar onLongtap={onLongTapMock} />);

    fireEvent(tree.getByRole('progressbar'), 'longPress');

    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressBar);
    });
  });

  xit('should trigger onTouchStart callback with WmProgressBar instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchStartMock = jest.fn();
    const tree = render(
      <WmProgressBar
        //  onTap={onTapMock}
        onTouchstart={onTouchStartMock}
      />
    );

    fireEvent(tree.getByRole('progressbar'), 'press');

    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      const callArg = onTouchStartMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressBar);
    });
  });

  xit('should trigger onTouchEnd callback with WmProgressBar instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchEndMock = jest.fn();
    const tree = render(
      <WmProgressBar
        // onTap={onTapMock}
        onTouchend={onTouchEndMock}
      />
    );

    fireEvent(tree.getByRole('progressbar'), 'pressOut');

    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      const callArg = onTouchEndMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressBar);
    });
  });

  it('should have width and height to be 0 when show is false', () => {
    const tree = render(<WmProgressBar {...commonProps} show={false} />);
    act(() => {
      jest.runAllTimers();
    });
    const rootElement = tree.root;
    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  // Tooltip functionality tests
  it('should render tooltip when showtooltip is true', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      showtooltip: true,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Check if tooltip component is rendered by finding the tooltip container view
    const views = tree.root.findAllByType('View' as any);
    const tooltipElement = views.find((child: any) => 
      child?.props?.style?.position === 'absolute' && 
      child?.props?.style?.zIndex === 10
    );
    expect(tooltipElement).toBeTruthy();
  });

  it('should not render tooltip when showtooltip is false', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      showtooltip: false,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Check if tooltip component is not rendered or hidden
    const views = tree.root.findAllByType('View' as any);
    const tooltipElements = views.filter((element: any) => 
      element?.props?.style?.position === 'absolute' && 
      element?.props?.style?.zIndex === 10
    );
    expect(tooltipElements.length).toBe(0);
  });

  it('should display default percentage text when no tooltip text is provided', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 50,
      showtooltip: true,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Find tooltip text element and check if it shows percentage
    const expectedPercentage = '50%';
    const tooltipText = tree.root.findByProps({ text: expectedPercentage });
    expect(tooltipText).toBeTruthy();
  });

  it('should call onTooltiptext callback and use returned text', () => {
    const onTooltiptextMock = jest.fn().mockReturnValue('Custom callback text');
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 75,
      showtooltip: true,
      onTooltiptext: onTooltiptextMock,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Check if callback was called with correct parameters
    expect(onTooltiptextMock).toHaveBeenCalledWith(
      undefined, // event
      expect.any(Object), // widget proxy
      0, // minvalue
      100, // maxvalue
      75 // percentage
    );
    
    // Check if callback result is used as tooltip text
    const tooltipText = tree.root.findByProps({ text: 'Custom callback text' });
    expect(tooltipText).toBeTruthy();
  });

  it('should position tooltip at correct progress position', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 30,
      showtooltip: true,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Find tooltip container and check its positioning
    const views = tree.root.findAllByType('View' as any);
    const tooltipContainer = views.find((child: any) => 
      child?.props?.style?.position === 'absolute' && 
      child?.props?.style?.zIndex === 10
    );
    
    expect(tooltipContainer?.props?.style?.left).toBe('30%');
  });

  it('should handle different tooltip positions', () => {
    const positions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
    
    positions.forEach(position => {
      const props: WmProgressBarProps = {
        ...commonProps,
        showtooltip: true,
        tooltipposition: position,
      };
      const tree = render(<WmProgressBar {...props} />);
      act(() => {
        jest.runAllTimers();
      });
      
      const tooltipElement = tree.root.findByProps({ direction: position });
      expect(tooltipElement).toBeTruthy();
    });
  });

  it('should handle edge case where progress value is at minimum', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 0,
      minvalue: 0,
      maxvalue: 100,
      showtooltip: true,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    const views = tree.root.findAllByType('View' as any);
    const tooltipContainer = views.find((child: any) => 
      child?.props?.style?.position === 'absolute' && 
      child?.props?.style?.zIndex === 10
    );
    
    expect(tooltipContainer?.props?.style?.left).toBe('0%');
  });

  it('should handle edge case where progress value is at maximum', () => {
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 100,
      minvalue: 0,
      maxvalue: 100,
      showtooltip: true,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    const views = tree.root.findAllByType('View' as any);
    const tooltipContainer = views.find((child: any) => 
      child?.props?.style?.position === 'absolute' && 
      child?.props?.style?.zIndex === 10
    );
    
    expect(tooltipContainer?.props?.style?.left).toBe('100%');
  });

  it('should handle onTooltiptext callback returning falsy value', () => {
    const onTooltiptextMock = jest.fn().mockReturnValue('');
    const props: WmProgressBarProps = {
      ...commonProps,
      datavalue: 50,
      showtooltip: true,
      onTooltiptext: onTooltiptextMock,
    };
    const tree = render(<WmProgressBar {...props} />);
    act(() => {
      jest.runAllTimers();
    });
    
    // Should fall back to default percentage when callback returns empty string
    const tooltipText = tree.root.findByProps({ text: '50%' });
    expect(tooltipText).toBeTruthy();
  });
});
