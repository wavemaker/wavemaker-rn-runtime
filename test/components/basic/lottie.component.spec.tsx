import React, { createRef } from 'react';
import { Platform } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import Lottie from 'react-lottie-player';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import WmLottie from '@wavemaker/app-rn-runtime/components/basic/lottie/lottie.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const renderComponent = (props = {}) => {
  const loadAsset = (data) => ({ url: data });

  const defaultProps = {
    id: 'testLottie',
    autoplay: true,
    loop: true,
    speed: 1,
    source: 'lottieAnimation.json',
  };
  return render(
    <AssetProvider value={loadAsset}>
      <WmLottie {...defaultProps} {...props} />
    </AssetProvider>
  );
};

jest.mock('axios');
jest.mock('react-lottie-player');

describe('Lottie component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders lottie player correctly on web', async () => {
    (Platform as any).OS = 'web';
    axios.get.mockResolvedValue({
      data: require('./mockData/lottie-animation.json'),
    });
    const tree = renderComponent();

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Lottie)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('renders lottie player correctly on native', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const tree = renderComponent();

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should call onComplete in web lottie', async () => {
    (Platform as any).OS = 'web';

    const customRef = createRef();
    const updateStateMock = jest.spyOn(WmLottie.prototype, 'updateState');
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );

    axios.get.mockResolvedValue({
      data: require('./mockData/lottie-animation.json'),
    });
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Lottie)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    fireEvent(tree.UNSAFE_getByType(Lottie), 'onComplete');

    expect(updateStateMock).toHaveBeenCalledWith({
      isCompleted: true,
    });
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onComplete', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should call onAnimationFinish in native lottie', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const updateStateMock = jest.spyOn(WmLottie.prototype, 'updateState');
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    fireEvent(tree.UNSAFE_getByType(LottieView), 'onAnimationFinish');

    expect(updateStateMock).toHaveBeenCalledWith({
      isCompleted: true,
    });
    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onComplete', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should invoke event callback with onPlay when autoplay prop is true in web lottie', async () => {
    (Platform as any).OS = 'web';

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );

    axios.get.mockResolvedValue({
      data: require('./mockData/lottie-animation.json'),
    });
    const tree = renderComponent({ ref: customRef, autoPlay: true });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Lottie)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPlay', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should invoke event callback with onPlay when autoplay prop is true in web lottie', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef, autoPlay: true });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPlay', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should invoke event callback with onReady when autoplay prop is false in web lottie', async () => {
    (Platform as any).OS = 'web';

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );

    axios.get.mockResolvedValue({
      data: require('./mockData/lottie-animation.json'),
    });
    const tree = renderComponent({ ref: customRef, autoPlay: false });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Lottie)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onReady', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should invoke event callback with onReady when autoplay prop is false in web lottie', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef, autoPlay: false });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onReady', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should render children as null when loadAsset is not provided through context', () => {
    const tree = render(<WmLottie />);

    expect(tree.toJSON()?.children).toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('should invoke event callback with onPlay event when play method in the component is called', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    act(() => {
      customRef.current.play();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPlay', [
      null,
      customRef.current.proxy,
    ]);
  });

  test('should call reset method in the component when play method in the component is called while isCompleted state is true', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const resetMock = jest.spyOn(WmLottie.prototype, 'reset');
    const tree = renderComponent({ ref: customRef });

    act(() => {
      customRef.current.updateState({ isCompleted: true });
    });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    act(() => {
      customRef.current.play();
    });

    await waitFor(() => {
      expect(resetMock).toHaveBeenCalled();
    });
  });

  test('should invoke event callback with onPlay event and sate isCompleted state to false when reset method in the component is called', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const updateStateMock = jest.spyOn(WmLottie.prototype, 'updateState');
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    act(() => {
      customRef.current.reset();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPlay', [
      null,
      customRef.current.proxy,
    ]);
    expect(updateStateMock).toHaveBeenCalledWith({ isCompleted: false });
  });

  test('should call reset and play method in Lottie when reset method in the component is called for native lottie', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const updateStateMock = jest.spyOn(WmLottie.prototype, 'updateState');
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    const lottieResetMock = jest.spyOn(customRef.current.lottie.current , 'reset');
    const lottiePlayMock = jest.spyOn(customRef.current.lottie.current , 'play');

    act(() => {
      customRef.current.reset();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPlay', [
      null,
      customRef.current.proxy,
    ]);
    expect(updateStateMock).toHaveBeenCalledWith({ isCompleted: false });
    expect(lottieResetMock).toHaveBeenCalled();
    expect(lottiePlayMock).toHaveBeenCalled();
  });

  test('should invoke event callback with onPause event when pause method in the component is called', async () => {
    (Platform as any).OS = 'ios'; // Set platform to ios

    const customRef = createRef();
    const invokeEventCallbackMock = jest.spyOn(
      WmLottie.prototype,
      'invokeEventCallback'
    );
    const tree = renderComponent({ ref: customRef });

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LottieView)).toBeTruthy();
      expect(tree).toMatchSnapshot();
    });

    const lottiePauseMock = jest.spyOn(customRef.current.lottie.current , 'pause');

    act(() => {
      customRef.current.pause();
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith('onPause', [
      null,
      customRef.current.proxy,
    ]);
    expect(lottiePauseMock).toHaveBeenCalled();
  });
});
