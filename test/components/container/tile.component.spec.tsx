import React, { ReactNode } from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import WmTile from '@wavemaker/app-rn-runtime/components/container/tile/tile.component';

describe('Test Tile component', () => {
  it('should render correctly with default props', () => {
    const props = {
      animation: 'fadeIn',
      children: <></>,
    };
    render(<WmTile {...props} />);
    expect(screen.getByTestId('animatableView')).toBeTruthy();
    expect(screen).toMatchSnapshot();
  });

  it('should have width and height to be 0 when show is false', () => {
    const props = {
      animation: 'fadeIn',
      children: <></>,
      show: false,
    };
    render(<WmTile {...props} />);
    expect(screen.getByTestId('animatableView').props.style.width).toBe(0);
    expect(screen.getByTestId('animatableView').props.style.height).toBe(0);
  });

  it('should render width and height', () => {
    const props = {
      animation: 'fadeIn',
      children: <></>,
    };
    const width = 50;
    const height = 70;
    render(
      <WmTile
        {...props}
        styles={{
          root: {
            width: width,
            height: height,
          },
        }}
      />
    );

    expect(screen).toMatchSnapshot();
    const viewEle = screen.getByTestId('animatableView');
    expect(viewEle.props.style.width).toBe(width);
    expect(viewEle.props.style.height).toBe(height);
  });

  it('renders children correctly', () => {
    const props = {
      animation: '',
      children: <></>,
    };
    const { getByText } = render(
      <WmTile {...props}>
        <WmButton caption="Button1" />
        <WmButton caption="Button2" />
      </WmTile>
    );

    expect(getByText('Button1')).toBeTruthy();
    expect(getByText('Button2')).toBeTruthy();
  });

  it('should handle animation and delay props', () => {
    const props = {
      animation: 'fadeIn',
      // animationdelay: 500,
      children: <></>,
    };
    render(<WmTile {...props} />);

    const animatedView = screen.getByTestId('animatableView');
    expect(animatedView).toBeTruthy();
    expect(animatedView.props.animation).toBe(props.animation);
    // expect(animatedLabel.props.delay).toBe(testprops.animationdelay);
  });

  it('should trigger onTap callback with WmLabel instance as one of the arguments', async () => {
    const onTapMock = jest.fn();
    render(<WmTile onTap={onTapMock} animation="fadeIn" children={<></>} />);

    fireEvent(screen.getByTestId('animatableView'), 'press');

    await waitFor(() => {
      expect(onTapMock).toHaveBeenCalled();
      const callArg = onTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmTile);
    });
  });

  it('should trigger onDoubleTap callback with WmLabel instance as one of the arguments', async () => {
    const onDoubleTapMock = jest.fn();
    render(
      <WmTile onDoubletap={onDoubleTapMock} animation="" children={<></>} />
    );

    fireEvent(screen.getByTestId('non_animatableView'), 'press');
    fireEvent(screen.getByTestId('non_animatableView'), 'press');

    await waitFor(() => {
      expect(onDoubleTapMock).toHaveBeenCalled();
      const callArg = onDoubleTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmTile);
    });
  });

  it('should trigger onLongTap callback with WmLabel instance as one of the arguments', async () => {
    const onLongTapMock = jest.fn();
    render(
      <WmTile onLongtap={onLongTapMock} animation="fadeIn" children={<></>} />
    );

    fireEvent(screen.getByTestId('animatableView'), 'longPress');

    await waitFor(() => {
      expect(onLongTapMock).toHaveBeenCalled();
      const callArg = onLongTapMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmTile);
    });
  });

  it('should trigger onTouchStart callback with WmLabel instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchStartMock = jest.fn();
    render(
      <WmTile
        // onTap={onTapMock}
        onTouchstart={onTouchStartMock}
        animation=""
        children={<></>}
      />
    );

    fireEvent(screen.getByTestId('non_animatableView'), 'press');

    await waitFor(() => {
      expect(onTouchStartMock).toHaveBeenCalled();
      const callArg = onTouchStartMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmTile);
    });
  });

  it('should trigger onTouchEnd callback with WmLabel instance as one of the arguments', async () => {
    // const onTapMock = jest.fn();
    const onTouchEndMock = jest.fn();
    render(
      <WmTile
        // onTap={onTapMock}
        onTouchend={onTouchEndMock}
        animation="fadeIn"
        children={<></>}
      />
    );

    fireEvent(screen.getByTestId('animatableView'), 'pressOut');

    await waitFor(() => {
      expect(onTouchEndMock).toHaveBeenCalled();
      const callArg = onTouchEndMock.mock.calls[0][1];
      expect(callArg).toBeInstanceOf(WmTile);
    });
  });
});
