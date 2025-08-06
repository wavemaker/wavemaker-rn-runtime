import React from 'react';
import { render, act } from '@testing-library/react-native';
import { StickyWrapper, StickyWrapperContext } from '@wavemaker/app-rn-runtime/core/sticky-wrapper';
import { View } from 'react-native';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: (initialValue: any) => ({
      value: initialValue,
      get: () => initialValue,
      set: jest.fn(),
      modify: jest.fn(),
      add: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn()
    }),
    useAnimatedStyle: (cb: any) => {
      return cb();
    },
    useAnimatedScrollHandler: (handlers: any) => {
      return (event: any) => {
        handlers.onScroll(event);
      };
    },
    withSpring: (toValue: any) => toValue,
    withTiming: (toValue: any) => toValue,
    runOnJS: (fn: any) => fn,
  }
});

// Mock injector
jest.mock('@wavemaker/app-rn-runtime/core/injector', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => ({
      edgeToEdgeConfig: {
        isEdgeToEdgeApp: false
      }
    }))
  }
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: any) => children,
}));

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  }
);

describe('StickyWrapper', () => {
  const notifier = new EventNotifier();
  const mockNotify = jest.spyOn(notifier, 'notify');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children and provide context', () => {
    let contextValue: any;
    
    render(
      <StickyWrapper hasAppnavbar={true} onscroll="topnav" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View testID="test-child" />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue.navHeight.value).toBe(80); // Default navbar height
    expect(contextValue.bottomTabHeight.value).toBe(0);
    expect(contextValue.scrollDirection.value).toBe(0);
    expect(contextValue.onScroll).toBeDefined();
    expect(contextValue.onScrollEndDrag).toBeDefined();
  });

  it('should handle scroll events and update context values', async () => {
    let contextValue: any;
    
    const { getByTestId } = render(
      <StickyWrapper hasAppnavbar={true} onscroll="topnav" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View testID="scrollable-view" />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    const scrollableView = getByTestId('scrollable-view');

    await act(async () => {
      // Simulate scroll down
      contextValue.onScroll({
        nativeEvent: {
          contentOffset: { y: 50 },
          contentSize: { height: 500 },
          layoutMeasurement: { height: 100 },
        }
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Verify scroll notification was sent
    expect(mockNotify).toHaveBeenCalledWith('scroll', [expect.objectContaining({
      nativeEvent: expect.objectContaining({
        contentOffset: { y: 0 },
        scrollDirection: 1
      })
    })]);

    // Verify scroll direction was updated
    expect(contextValue.scrollDirection.value).toBe(1);
  });

  it('should calculate correct navHeight based on props', () => {
    let contextValue: any;
    
    // Without appnavbar
    const { rerender } = render(
      <StickyWrapper hasAppnavbar={false} onscroll="none" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    expect(contextValue.navHeight.value).toBe(0);

    // With appnavbar and topnav scroll
    rerender(
      <StickyWrapper hasAppnavbar={true} onscroll="topnav" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    expect(contextValue.navHeight.value).toBe(80);
  });

  // TODO: translation UI tests on scroll
  xit('should update translation values on scroll', async () => {
    let contextValue: any;
    
    render(
      <StickyWrapper hasAppnavbar={true} onscroll="topnav" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View testID="scrollable-view" />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    // Initialize shared values
    contextValue.navHeight = { value: 80 };
    contextValue.stickyNavTranslateY = { value: 0 };
    contextValue.stickyContainerTranslateY = { value: 0 };
    contextValue.scrollY = { value: 0 };
    contextValue.prevScrollY = { value: 0 };

    // Initial scroll down
    const scrollHandler = contextValue.onScroll;
    await act(async () => {
      scrollHandler({
        nativeEvent: {
          contentOffset: { y: 50 },
          contentSize: { height: 500 },
          layoutMeasurement: { height: 100 }
        }
      });
      contextValue.stickyNavTranslateY.value = 50;
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Verify nav translation
    expect(contextValue.stickyNavTranslateY?.value).toBe(50);
    expect(contextValue.stickyContainerTranslateY.value).toBe(0);
    expect(contextValue.stickyContainerAnimateStyle.transform[0].translateY).toBeDefined();

    // Scroll up
    await act(async () => {
      scrollHandler({
        nativeEvent: {
          contentOffset: { y: 20 },
          contentSize: { height: 500 },
          layoutMeasurement: { height: 100 }
        }
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    await timer(500);

    // Verify container translation
    expect(contextValue.stickyContainerTranslateY.value).toBe(0);
    expect(contextValue.stickyContainerAnimateStyle.transform[0].translateY).toBeDefined();
  });

  it('should handle scroll end drag', async () => {
    let contextValue: any;
    const mockScrollTo = jest.fn();
    
    render(
      <StickyWrapper hasAppnavbar={true} onscroll="topnav" notifier={notifier}>
        <StickyWrapperContext.Consumer>
          {(value) => {
            contextValue = value;
            return <View testID="scrollable-view" />;
          }}
        </StickyWrapperContext.Consumer>
      </StickyWrapper>
    );

    await act(async () => {
      // Set up scroll state first
      contextValue.onScroll({
        nativeEvent: {
          contentOffset: { y: 50 },
          contentSize: { height: 500 },
          layoutMeasurement: { height: 100 }
        }
      });

      // Now trigger scroll end drag
      contextValue.onScrollEndDrag({ current: { scrollTo: mockScrollTo } });
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Verify scroll adjustment was attempted
    expect(mockScrollTo).toHaveBeenCalled();
  });
});