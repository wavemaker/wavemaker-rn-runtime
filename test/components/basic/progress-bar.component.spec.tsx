import React from 'react';
import {
  act,
  fireEvent,
  render,
  waitFor,
  screen,
} from '@testing-library/react-native';
import WmProgressBar from '@wavemaker/app-rn-runtime/components/basic/progress-bar/progress-bar.component';
import WmProgressBarProps from '@wavemaker/app-rn-runtime/components/basic/progress-bar/progress-bar.props';
import ThemeVariables from '../../../src/styles/theme.variables';
import Color from 'color';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

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
      datavalue: 50,
      minvalue: 10,
      maxvalue: 60,
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
    expect(progressBar.props.accessibilityValue.now).toBe(value);
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

  it('should render with accessibility properties', () => {
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

  it('should trigger onTouchStart callback with WmProgressBar instance as one of the arguments', async () => {
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

  it('should trigger onTouchEnd callback with WmProgressBar instance as one of the arguments', async () => {
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
});
