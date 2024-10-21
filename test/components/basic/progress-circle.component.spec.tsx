// progress-circle.test.tsx
import React, { createRef } from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Text } from 'react-native';

import '@testing-library/jest-native/extend-expect';
import WmProgressCircle from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.component';
import WmProgressCircleProps from '@wavemaker/app-rn-runtime/components/basic/progress-circle/progress-circle.props';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Tappable } from '../../../src/core/tappable.component';
import Color from 'color';
import ThemeVariables from '../../../src/styles/theme.variables';

// Mock AnimatedCircularProgress due to its inherent animations
jest.mock('react-native-circular-progress', () => ({
  AnimatedCircularProgress: jest.fn(),
}));

const themeVariables = new ThemeVariables();

describe('WmProgressCircle', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  xit('renders correctly with default props', () => {
    render(<WmProgressCircle />);
    expect(screen.getByRole('progresscircle')).toBeTruthy();
    const animatedProgress = screen.UNSAFE_getByType(AnimatedCircularProgress);
    expect(animatedProgress.props.fill).toBe(
      new WmProgressCircleProps().datavalue
    );
    expect(screen).toMatchSnapshot();
  });

  it('calculates the progress value correctly', () => {
    render(<WmProgressCircle datavalue={50} minvalue={0} maxvalue={100} />);
    const animatedProgress = screen.UNSAFE_getByType(AnimatedCircularProgress);
    expect(animatedProgress.props.fill).toBe(50);
  });

  it('renders title and subtitle when captionplacement is not hidden', async () => {
    const props = {
      datavalue: 50,
      minvalue: 0,
      maxvalue: 100,
      title: 'Test Title',
      subtitle: 'Test Subtitle',
    };
    render(<WmProgressCircle {...props} />);
    const animatedProgressChild = screen
      .UNSAFE_getByType(AnimatedCircularProgress)
      .props.children();
    const textElements = animatedProgressChild.props.children;
    expect(textElements[0].props.children).toBe(props.title);
    expect(textElements[1].props.children).toBe(props.subtitle);
  });

  xit('applies accessibility properties correctly', () => {
    render(
      <WmProgressCircle
        accessibilitylabel="ProgressCircle"
        hint="progresscircle"
      />
    );
    expect(screen.getByLabelText('ProgressCircle')).toBeTruthy();
    expect(screen.getByRole('progresscircle')).toBeTruthy();
    expect(screen.getByA11yHint('progresscircle')).toBeTruthy();
  });

  it('calculates radius on layout change', async () => {
    const ref = createRef();
    const { getByTestId } = render(
      <WmProgressCircle datavalue={50} ref={ref} />
    );

    const updateStateMock = jest.spyOn(
      WmProgressCircle.prototype,
      'updateState'
    );
    ref.current.onLayout({
      nativeEvent: { layout: { width: 100, height: 50 } },
    });
    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(ref.current.state.radius).toBe(50);
    });

    ref.current.onLayout({
      nativeEvent: { layout: { width: 100 } },
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(ref.current.state.radius).toBe(100);
    });

    ref.current.onLayout({
      nativeEvent: { layout: { height: 50 } },
    });

    await waitFor(() => {
      expect(updateStateMock).toHaveBeenCalled();
      expect(ref.current.state.radius).toBe(50);
    });
  });

  xit('hides text when caption placement is hidden', () => {
    render(<WmProgressCircle captionplacement="hidden" />);
    const asdf = screen.getByTestId('undefined_title');
    const animatedProgressChild = screen
      .UNSAFE_getByType(AnimatedCircularProgress)
      .props.children();
    const textElements = animatedProgressChild.props.children;
    expect(textElements[0].props.children).toBe('');
  });

  it('should trigger onTap callback with WmProgressCircle instance as one of the arguments', async () => {
    const onTapMock = jest.fn();
    const tree = render(<WmProgressCircle onTap={onTapMock} />);
    const animatedCircularProgress = tree.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    fireEvent(animatedCircularProgress, 'press');

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      const callArg = onTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressCircle);
    });
  });

  it('should trigger onDoubleTap callback with WmProgressCircle instance as one of the arguments', async () => {
    const onDoubleTapMock = jest.fn();
    const tree = render(<WmProgressCircle onDoubletap={onDoubleTapMock} />);
    const animatedCircularProgress = tree.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    fireEvent(animatedCircularProgress, 'press');
    fireEvent(animatedCircularProgress, 'press');

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressCircle);
    });
  });

  it('should trigger onLongTap callback with WmProgressCircle instance as one of the arguments', async () => {
    const onLongTapMock = jest.fn();
    const tree = render(<WmProgressCircle onLongtap={onLongTapMock} />);
    const animatedCircularProgress = tree.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    fireEvent(animatedCircularProgress, 'longPress');

    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressCircle);
    });
  });

  xit('should trigger onTouchStart callback with WmProgressCircle instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchStartMock = jest.fn();
    const tree = render(
      <WmProgressCircle
        // onTap={onTapMock}
        onTouchstart={onTouchStartMock}
      />
    );
    const animatedCircularProgress = tree.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    fireEvent(animatedCircularProgress, 'press');

    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      const callArg = onTouchStartMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressCircle);
    });
  });

  xit('should trigger onTouchEnd callback with WmProgressCircle instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchEndMock = jest.fn();
    const tree = render(
      <WmProgressCircle
        // onTap={onTapMock}
        onTouchend={onTouchEndMock}
      />
    );
    const animatedCircularProgress = tree.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    fireEvent(animatedCircularProgress, 'pressOut');

    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      const callArg = onTouchEndMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmProgressCircle);
    });
  });

  it('should have width and height to be 0 when show is false', () => {
    const tree = render(<WmProgressCircle show={false} />);
    const rootElement = tree.root;
    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  it('should render with style defined for the respective type', () => {
    const props = {
      type: 'success',
    };
    render(<WmProgressCircle {...props} />);
    const animatedCircularProgress = screen.UNSAFE_getByType(
      AnimatedCircularProgress
    );
    expect(animatedCircularProgress.props.backgroundColor).toBe(
      Color(themeVariables.progressCircleSuccessColor)
        .fade(0.8)
        .rgb()
        .toString()
    );
  });
});
