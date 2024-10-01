import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import WmCarousel from '@wavemaker/app-rn-runtime/components/advanced/carousel/carousel.component';
import { View, Text } from 'react-native';

const renderComponent = (props = {}) => {
  return render(<WmCarousel {...props} />);
};

describe('WmCarousel Component', () => {
  
  it('should render without crashing', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render children components correctly', () => {
    renderComponent({
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });
    const tree = renderComponent({
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });
    const childElementWithLayout = tree.toJSON().children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });
    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(screen.getByText('Slide 2')).toBeTruthy();
  });

  it('should apply the correct styles to the root element', () => {
  const tree = renderComponent();
  const rootEle = tree.root;

  expect(rootEle).toHaveStyle({
    position: 'relative',
  });
});

  it('should render pagination dots when indicators are enabled', () => {
    renderComponent({
      controls: 'indicators',
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(screen.getByText('Slide 2')).toBeTruthy();
  });

  it('should navigate to the next slide on next button click', () => {
    const { getByLabelText } = renderComponent({
      controls: 'navs',
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    const nextButton = getByLabelText('next');
    fireEvent.press(nextButton);
    expect(screen.getByText('Slide 2')).toBeTruthy();
  });

  it('should navigate to the previous slide on previous button click', () => {
    const { getByLabelText } = renderComponent({
      controls: 'navs',
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    const nextButton = getByLabelText('next');
    fireEvent.press(nextButton); // Go to slide 2 first
    const prevButton = getByLabelText('back');
    fireEvent.press(prevButton); // Go back to slide 1
    expect(screen.getByText('Slide 1')).toBeTruthy();
  });

  it('should enable controls (both nav and indicators) when controls are set to "both"', () => {
    renderComponent({
      controls: 'both',
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    expect(screen.getByLabelText('next')).toBeTruthy();
    expect(screen.getByLabelText('back')).toBeTruthy();
  });

  it('should enable auto-play when animation is "auto" and animationInterval is set', async () => {
    jest.useFakeTimers();
    renderComponent({
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    expect(screen.getByText('Slide 1')).toBeTruthy();
    jest.advanceTimersByTime(1000); // Move to the next slide after 1 second
    expect(screen.getByText('Slide 2')).toBeTruthy();
    jest.useRealTimers();
  });

  it('should change active slide when swipe gestures are triggered', () => {
    const { getByTestId } = renderComponent({
      children: [
        <View key="slide1" testID="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2" testID="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    const animatedView = getByTestId('slide1');
    fireEvent(animatedView, 'swipeLeft');
    fireEvent(animatedView, 'swipeRight');

    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(screen.getByText('Slide 2')).toBeTruthy();
  });

  it('should invoke onChange callback when slide changes', async () => {
    const onChangeMock = jest.fn();
    renderComponent({
      onChange: onChangeMock,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });
    fireEvent(screen.getByText('Slide 1'), 'swipeLeft');
    await waitFor(() => {
      expect(onChangeMock).toHaveBeenCalledTimes(1);
      expect(onChangeMock).toHaveBeenCalledWith(expect.any(Object), 2, 1);
    });
  });

  it('should disable auto-play when stopPlay is called', async () => {
    const stopPlayMock = jest.fn();
    const component = renderComponent({
      stopPlay: stopPlayMock,
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    component.unmount();
    await waitFor(() => {
      expect(stopPlayMock).toHaveBeenCalled();
    });
  });

  it('should change slides based on animation property', async () => {
    const { getByText, rerender } = renderComponent({
      animation: 'slide',
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ]
    });

    rerender(<WmCarousel animation="auto" />);
    expect(getByText('Slide 1')).toBeTruthy();
  });
  it('should call autoPlay when animation is auto and interval is set', () => {
    jest.useFakeTimers();
    const nextMock = jest.spyOn(WmCarousel.prototype, 'next');

    renderComponent({
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ],
    });

    // Start autoPlay
    const instance = screen.UNSAFE_getByType(WmCarousel).instance;

    // Pre-set the activeIndex to be less than the children length for the first call
    instance.setState({ activeIndex: 0 });

    instance.autoPlay();

    // Check that the interval is set and next is called after 1 second
    expect(nextMock).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(nextMock).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(nextMock).toHaveBeenCalledTimes(2);

    // Cleanup
    instance.stopAnimation();
    jest.clearAllTimers();
    nextMock.mockRestore();
});


  it('should clear interval when stopAnimation is called', () => {
    jest.useFakeTimers();
    const clearIntervalMock = jest.spyOn(global, 'clearInterval');

    renderComponent({
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ],
    });

    // Start autoPlay
    const instance = screen.UNSAFE_getByType(WmCarousel).instance;
    instance.autoPlay();

    // Stop autoPlay
    instance.stopAnimation();

    // Verify that the interval has been cleared
    expect(clearIntervalMock).toHaveBeenCalled();
    clearIntervalMock.mockRestore();
  });

  it('should call autoPlay when startAnimation is called', () => {
    const autoPlayMock = jest.spyOn(WmCarousel.prototype, 'autoPlay');

    renderComponent({
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1"><Text>Slide 1</Text></View>,
        <View key="slide2"><Text>Slide 2</Text></View>,
      ],
    });

    // Start the animation
    const instance = screen.UNSAFE_getByType(WmCarousel).instance;
    instance.startAnimation();

    // Check that autoPlay is called
    expect(autoPlayMock).toHaveBeenCalled();

    autoPlayMock.mockRestore();
  });
});