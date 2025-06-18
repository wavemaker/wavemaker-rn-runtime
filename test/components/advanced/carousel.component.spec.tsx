import React, { createRef } from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import WmCarousel from '@wavemaker/app-rn-runtime/components/advanced/carousel/carousel.component';
import { View, Text } from 'react-native';

import TimingAnimation from 'react-native/Libraries/Animated/animations/TimingAnimation';

jest.mock('react-native/Libraries/Animated/Easing', () => {
  const originalModule = jest.requireActual(
    'react-native/Libraries/Animated/Easing'
  );
  return {
    _esModule: true,
    default: {
      ...originalModule,
      linear: jest.fn(() => 'linear-mock'),
      ease: jest.fn(() => 'ease-mock'),
      bounce: jest.fn(() => 'bounce-mock'),
      in: jest.fn(() => 'in-mock'),
      out: jest.fn(() => 'out-mock'),
      inOut: jest.fn(() => 'inOut-mock'),
      bezier: jest.fn(),
      // Add other methods you use if needed
    },
  };
});

jest.mock('react-native/Libraries/Animated/animations/TimingAnimation', () => {
  const originalModule = jest.requireActual(
    'react-native/Libraries/Animated/animations/TimingAnimation'
  );

  // Create a mock class that extends the original
  class MockTimingAnimation extends originalModule.default {
    constructor(config) {
      super(config);
      this._easing = jest.fn(originalModule.default.prototype._easing);
    }

    // You can add or override more methods here if needed
    start = jest.fn(originalModule.default.prototype.start);
    // start(fromValue, onUpdate, onEnd) {
    //   onUpdate(this._toValue);
    //   onEnd({ finished: true });
    // }
    onUpdate = jest.fn(originalModule.default.prototype.onUpdate);
    stop = jest.fn(originalModule.default.prototype.stop);
  }

  return {
    __esModule: true,
    default: MockTimingAnimation,
  };
});

import { Easing } from 'react-native';

jest.mock('react-native/Libraries/Animated/nodes/AnimatedInterpolation', () => {
  return {
    __esModule: true,
    default: jest.fn((parent, config) => ({
      _parent: parent,
      _config: {
        inputRange: [0, 1],
        outputRange: [0, 1],
        easing: jest.fn(),
        extrapolate: 'extend',
        extrapolateLeft: 'extend',
        extrapolateRight: 'extend',
        ...config,
      },
      interpolate: jest.fn(),
      __getValue: jest.fn(),
      __attach: jest.fn(),
      __detach: jest.fn(),
      __getNativeConfig: jest.fn(),
    })),
  };
});

const renderComponent = (props = {}) => {
  return render(<WmCarousel {...props} name="test_carousel" />);
};

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('WmCarousel Component', () => {
  it('should render without crashing', () => {
    const { toJSON } = renderComponent();
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render children components correctly', () => {
    const tree = renderComponent({
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });
    const childElementWithLayout = tree.toJSON()[1].children[0];

    fireEvent(childElementWithLayout, 'layout', {
      nativeEvent: {
        layout: {
          width: 100,
          height: 100,
        },
      },
    });
    expect(tree.getByText('Slide 1')).toBeTruthy();
    expect(tree.getByText('Slide 2')).toBeTruthy();
  });

  it('should render pagination dots when indicators are enabled', () => {
    renderComponent({
      controls: 'indicators',
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });

    expect(screen.getByTestId('test_carousel_indicator0')).toBeTruthy();
    expect(screen.getByTestId('test_carousel_indicator1')).toBeTruthy();
  });

  it('should render pagination dots based on the dataset length', () => {
    const dataset = [
      <View key="slide1">
        <Text>Slide 1</Text>
      </View>,
      <View key="slide2">
        <Text>Slide 2</Text>
      </View>,
      <View key="slide3">
        <Text>Slide 3</Text>
      </View>,
      <View key="slide4">
        <Text>Slide 4</Text>
      </View>,
      <View key="slide5">
        <Text>Slide 5</Text>
      </View>,
      <View key="slide6">
        <Text>Slide 6</Text>
      </View>,
    ];
  
    renderComponent({
      controls: 'indicators',
      children: dataset,
    });
  
    const expectedDots = dataset.length > 5 ? 5 : dataset.length;
    for (let i = 0; i < expectedDots; i++) {
      expect(screen.getByTestId(`test_carousel_indicator${i}`)).toBeTruthy();
    }
  });
  
  it('should render pagination dots based on the dataset length for dynamic carousel', () => {
    const dataset = [
      {
        "imagesrc": "https://picsum.photos/200/300"
      },
      {
        "imagesrc": "https://picsum.photos/200/300"
      },
      {
        "imagesrc": "https://picsum.photos/200/300"
      }
    ];
  
    renderComponent({
      controls: 'indicators',
      dataset: dataset,
      type: "dynamic",
      renderSlide: (item: any, index: any, that: any) => {
        return (
          <View key={`${index}`} testID={`carousel_${index}`}>
            <Text>Slide {index}</Text>
          </View>
        )
      }
    });
  
    const expectedDots = dataset.length > 5 ? 5 : dataset.length;
    for (let i = 0; i < expectedDots; i++) {
      expect(screen.getByTestId(`carousel_${i}`)).toBeTruthy();
    }
  });
  
  xit('should navigate to the next slide on press of any item inside carousel content', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const { getByLabelText } = renderComponent({
      ref,
      animation: 'none',
      controls: 'navs',
      onChange: onChangeMock,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });

    const slide1Content = screen.getByText('Slide 1');

    await timer(1000); // timer added because of the settimeout present in autoPlay() else condition

    await act(async () => {
      fireEvent.press(slide1Content);
      await timer(300);
    });
    expect(screen.getByText('Slide 2')).toBeTruthy();

    expect(ref.current.state.activeIndex).toBe(2);
    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 2, 1);
  });

  it('should enable controls (both nav and indicators) when controls are set to "both"', () => {
    renderComponent({
      controls: 'both',
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });

    expect(screen.getByLabelText('next')).toBeTruthy();
    expect(screen.getByLabelText('back')).toBeTruthy();
    expect(screen.getByTestId('test_carousel_indicator0')).toBeTruthy();
    expect(screen.getByTestId('test_carousel_indicator1')).toBeTruthy();
  });

  it('should navigate to the next slide on next button click', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const { getByLabelText } = renderComponent({
      ref,
      animation: 'none',
      controls: 'navs',
      onChange: onChangeMock,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });
    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');

    act(() => {
      fireEvent(carouselItem0, 'layout', {
        nativeEvent: {
          layout: {
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },
        },
      });
    });

    await timer(1000);
    const nextButton = getByLabelText('next');
    await act(async () => {
      fireEvent.press(nextButton);
      await timer(500);
    });
    expect(screen.getByText('Slide 2')).toBeTruthy();

    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 2, 1);
    expect(ref.current.state.activeIndex).toBe(2);

    await act(async () => {
      fireEvent.press(nextButton); //should go back to first slide
      await timer(500);
    });

    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 1, 2);
    expect(ref.current.state.activeIndex).toBe(1);
  });
  it('should stop auto-play at last item when stopatlast is true', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    renderComponent({
      ref,
      onChange: onChangeMock,
      animation: 'auto',
      animationinterval: 0.5,
      stopatlast: true,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });
  
    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');
  
    fireEvent(carouselItem0, 'layout', {
      nativeEvent: {
        layout: { x: 0, y: 0, width: 200, height: 200 },
      },
    });
    fireEvent(carouselItem1, 'layout', {
      nativeEvent: {
        layout: { x: 200, y: 0, width: 200, height: 200 },
      },
    });
  
    await timer(1000); 
  
    await timer(700);
    expect((ref.current as any).state.activeIndex).toBe(2);
  
    await timer(800);
    expect((ref.current as any).state.activeIndex).toBe(2); 
  });
  
  it('should not navigate forward from last item when stopatlast is true', async () => {
    const ref = createRef();
    const { getByLabelText } = renderComponent({
      ref,
      animation: 'none',
      controls: 'navs',
      stopatlast: true,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });
  
    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');
  
    fireEvent(carouselItem0, 'layout', {
      nativeEvent: {
        layout: { x: 0, y: 0, width: 200, height: 200 },
      },
    });
    fireEvent(carouselItem1, 'layout', {
      nativeEvent: {
        layout: { x: 200, y: 0, width: 200, height: 200 },
      },
    });
  
    await timer(1000); 
  
    const nextButton = getByLabelText('next');
    fireEvent.press(nextButton);
    await timer(500);
    expect((ref.current as any).state.activeIndex).toBe(2);

    fireEvent.press(nextButton);
    await timer(500);
    expect((ref.current as any).state.activeIndex).toBe(2); 
  });
  
  it('should allow normal looping when stopatlast is false', async () => {
    const ref = createRef();
    const { getByLabelText } = renderComponent({
      ref,
      animation: 'none',
      controls: 'navs',
      stopatlast: false,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });
  
    // Add layout events
    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');
  
    fireEvent(carouselItem0, 'layout', {
      nativeEvent: {
        layout: { x: 0, y: 0, width: 200, height: 200 },
      },
    });
    fireEvent(carouselItem1, 'layout', {
      nativeEvent: {
        layout: { x: 200, y: 0, width: 200, height: 200 },
      },
    });
  
    await timer(1000); 
    const nextButton = getByLabelText('next');
  
    fireEvent.press(nextButton);
    await timer(500);
    expect((ref.current as any).state.activeIndex).toBe(2);
    fireEvent.press(nextButton);
    await timer(500);
    expect((ref.current as any).state.activeIndex).toBe(1); 
  });
  it('should navigate to the previous slide on previous button click', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const { getByLabelText } = renderComponent({
      ref,
      animation: 'none',
      controls: 'navs',
      onChange: onChangeMock,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
      ],
    });

    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');

    act(() => {
      fireEvent(carouselItem0, 'layout', {
        nativeEvent: {
          layout: {
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },
        },
      });
    });

    await timer(1000);

    const nextButton = getByLabelText('next');
    await act(async () => {
      fireEvent.press(nextButton); // Go to slide 2 first
      await timer(500);
    });

    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 2, 1);
    expect(ref.current.state.activeIndex).toBe(2);

    const prevButton = getByLabelText('back');
    await act(async () => {
      fireEvent.press(prevButton); // Go back to slide 1
      await timer(500);
    });

    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 1, 2);
    expect(ref.current.state.activeIndex).toBe(1);
  });

  it('should auto-play when animation is "auto" and animationInterval is set', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    renderComponent({
      ref,
      onChange: onChangeMock,
      animation: 'auto',
      animationinterval: 0.5,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
        <View key="slide3">
          <Text>Slide 3</Text>
        </View>,
      ],
    });

    expect(screen.getByText('Slide 1')).toBeTruthy();
    expect(screen.getByText('Slide 2')).toBeTruthy();
    const carouselItem0 = screen.getByTestId('carousel_item_0');
    const carouselItem1 = screen.getByTestId('carousel_item_1');
    const carouselItem2 = screen.getByTestId('carousel_item_2');

    act(() => {
      fireEvent(carouselItem0, 'layout', {
        nativeEvent: {
          layout: {
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },
        },
      });
    });

    await act(async () => {
      await timer(1600);
    });
    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 2, 1);
    expect(ref.current.state.activeIndex).toBe(2);

    act(() => {
      fireEvent(carouselItem1, 'layout', {
        nativeEvent: {
          layout: {
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },
        },
      });
    });

    await act(async () => {
      await timer(700);
    });
    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 3, 2);

    act(() => {
      fireEvent(carouselItem2, 'layout', {
        nativeEvent: {
          layout: {
            x: 100,
            y: 100,
            width: 200,
            height: 200,
          },
        },
      });
    });

    await act(async () => {
      await timer(600);
    });
    expect(onChangeMock).toHaveBeenCalledWith(ref.current.proxy, 1, 3);
    expect(ref.current.state.activeIndex).toBe(1);
  }, 10000);

  // it('should change active slide when swipe gestures are triggered', () => {
  //   const { getByTestId } = renderComponent({
  //     children: [
  //       <View key="slide1" testID="slide1">
  //         <Text>Slide 1</Text>
  //       </View>,
  //       <View key="slide2" testID="slide2">
  //         <Text>Slide 2</Text>
  //       </View>,
  //     ],
  //   });
  //   expect(screen).toMatchSnapshot();
  //   const animatedView = getByTestId('slide1');
  //   fireEvent(animatedView, 'swipeLeft');
  //   fireEvent(animatedView, 'swipeRight');

  //   expect(screen.getByText('Slide 1')).toBeTruthy();
  //   expect(screen.getByText('Slide 2')).toBeTruthy();
  // });

  it('should clear interval when stopAnimation is called', () => {
    jest.useFakeTimers();
    const clearIntervalMock = jest.spyOn(global, 'clearInterval');

    renderComponent({
      animation: 'auto',
      animationinterval: 1,
      children: [
        <View key="slide1">
          <Text>Slide 1</Text>
        </View>,
        <View key="slide2">
          <Text>Slide 2</Text>
        </View>,
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


  
it('wraps a single React child into an array', () => {
     const dataset = [
      <View key="slide1">
        <Text>Slide 1</Text>
      </View>,
    
    ];
  const ref = createRef();
  renderComponent({
      ref,
      animation: 'none',
    });
const data = ref.current.extractChildrenData(dataset);
expect(Array.isArray(data)).toBe(true);

});



  it('should apply the correct styles to the root element', () => {
    const tree = renderComponent({
      styles: {
        root: {
          rippleColor: '#893334',
        },
      },
    });
    const rootEle = tree.toJSON()[1];

    expect(rootEle).toHaveStyle({
      position: 'relative',
      rippleColor: '#893334',
    });
  });
});
