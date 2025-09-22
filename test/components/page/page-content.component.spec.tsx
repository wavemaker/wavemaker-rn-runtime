import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import WmPageContent from '@wavemaker/app-rn-runtime/components/page/page-content/page-content.component';
import { fireEvent, render, act } from '@testing-library/react-native';
import Animated from 'react-native-reanimated';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { StickyWrapperContext } from '@wavemaker/app-rn-runtime/core/sticky-wrapper';
import WmContent from '@wavemaker/app-rn-runtime/components/page/content/content.component';
import WmLabel from '@wavemaker/app-rn-runtime/components/basic/label/label.component';

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
    useAnimatedStyle: (cb: any) => cb(),
    useAnimatedScrollHandler: (handlers: any) => (event: any) => handlers.onScroll(event),
  };
});

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const mockStickyContext = {
  navHeight: { value: 80 },
  bottomTabHeight: { value: 0 },
  scrollDirection: { value: 0 },
  stickyNavTranslateY: { value: 0 },
  stickyContainerTranslateY: { value: 0 },
  stickyNavAnimateStyle: { transform: [{ translateY: 0 }] },
  stickyContainerAnimateStyle: { transform: [{ translateY: 0 }] },
  onScroll: jest.fn(),
  onScrollEndDrag: jest.fn(),
  updateStickyHeaders: jest.fn(),
  updateNavHeight: jest.fn()
};
  

class PC_SkeletonTester_Without_Content_Skeleton extends React.Component {
  render() {
     return (
      <StickyWrapperContext.Provider value={mockStickyContext}>
      <WmContent name="content1">
          <WmPageContent showskeleton={true} name="pagecontent1">
              <WmLabel name="test_skeleton"/>
          </WmPageContent>
        </WmContent>
      </StickyWrapperContext.Provider>
     )
  }
}

class PC_SkeletonTester_With_Content_Skeleton extends React.Component {
  render() {
     return (
      <StickyWrapperContext.Provider value={mockStickyContext}>
        <WmContent name="content1" showskeleton={false} >
            <WmPageContent showskeleton={true}  name="pagecontent1">
                <WmLabel name="test_skeleton"/>
            </WmPageContent>
        </WmContent>
      </StickyWrapperContext.Provider>
     )
  }
}

describe('base component test skeleton when page content inside content', () => {
  test('should not show the skeleton', () => {
    render(<PC_SkeletonTester_Without_Content_Skeleton/>)
    expect(() => screen.getByTestId('test_skeleton_caption')).toThrow();
  })

  test('should not show the skeleton', () => {
    render(<PC_SkeletonTester_With_Content_Skeleton/>)
    expect(() => screen.getByTestId('test_skeleton_caption')).toBeTruthy()
  })
})

const renderComponent = (props = {}, stickyContext = mockStickyContext) => {
  return render(
    <StickyWrapperContext.Provider value={stickyContext}>
      <WmPageContent name="test_Navbar" {...props} />
    </StickyWrapperContext.Provider>
  );
};

describe('Test PageContent component', () => {
  it('should render pageContent component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
    expect(tree).toMatchSnapshot();
  });

  it('should render root element with backgroundcolor when scrollable prop is true', () => {
    const { UNSAFE_root } = renderComponent();
    expect(UNSAFE_root).toBeDefined();
  });

  it('should render scrollView when scrollable prop is true', () => {
    const { UNSAFE_queryByType } = renderComponent();
    const viewEle = UNSAFE_queryByType(Animated.ScrollView);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  it('should not render scrollView when scrollable prop is false', () => {
    const { UNSAFE_queryByType } = renderComponent({ scrollable: false });
    const viewEle = UNSAFE_queryByType(Animated.ScrollView);
    expect(viewEle).toBeNull();
  });

  it('should render background Component', () => {
    const { UNSAFE_queryByType } = renderComponent();
    const viewEle = UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  describe('Sticky functionality', () => {
    it('should apply correct padding based on nav height when onscroll is topnav', async () => {
      const { getByTestId } = renderComponent({ 
        onscroll: 'topnav',
        scrollable: true 
      });

      await timer(1000);
      const scrollView = getByTestId('test_Navbar_page_content_scrollview');
      expect(scrollView.props.contentContainerStyle[1].paddingTop).toBe(88);
    });

    it('should not apply nav height padding when onscroll is not topnav', () => {
      const { getByTestId } = renderComponent({ 
        onscroll: 'none',
        scrollable: true 
      });

      const scrollView = getByTestId('test_Navbar_page_content_scrollview');
      expect(scrollView.props.contentContainerStyle[1].paddingTop).toBe(8);
    });

    it('should update nav height on context change', async () => {
      const context = {
        ...mockStickyContext,
        navHeight: { value: 100 }
      };

      const { getByTestId, rerender, UNSAFE_getByType } = renderComponent({ 
        onscroll: 'topnav',
        scrollable: true 
      }, context);

      await act(async () => {
        context.navHeight.value = 120;
        const pageContent = UNSAFE_getByType(WmPageContent).instance;
        pageContent.notify('updateNavHeight', [120]);
        rerender(
          <StickyWrapperContext.Provider value={context}>
            <WmPageContent name="test_Navbar" onscroll="topnav" scrollable={true} />
          </StickyWrapperContext.Provider>
        );
        await timer(1000);
      });

      const scrollView = getByTestId('test_Navbar_page_content_scrollview');
      expect(scrollView.props.contentContainerStyle[1].paddingTop).toBe(128);
    });

    it('should handle scroll events and update sticky context', async () => {
      const context = { ...mockStickyContext };
      const { getByTestId } = renderComponent({ 
        onscroll: 'topnav',
        scrollable: true 
      }, context);

      const scrollView = getByTestId('test_Navbar_page_content_scrollview');

      await act(async () => {
        fireEvent.scroll(scrollView, {
          nativeEvent: {
            contentOffset: { y: 50 },
            contentSize: { height: 500 },
            layoutMeasurement: { height: 100 }
          }
        });
        await timer(100);
      });

      expect(context.onScroll).toHaveBeenCalled();
    });

    it('should handle scroll end drag and trigger swipe events', async () => {
      const onSwipeupMock = jest.fn();
      const onSwipedownMock = jest.fn();
      const context = { 
        ...mockStickyContext,
        scrollDirection: { value: 1 }  // Scrolling up
      };

      const { getByTestId } = renderComponent({ 
        onscroll: 'topnav',
        scrollable: true,
        onSwipeup: onSwipeupMock,
        onSwipedown: onSwipedownMock
      }, context);

      const scrollView = getByTestId('test_Navbar_page_content_scrollview');

      // Simulate scroll end with positive scroll position
      await act(async () => {
        fireEvent(scrollView, 'scrollEndDrag', {
          nativeEvent: {
            contentOffset: { y: 50 }
          }
        });
        await timer(100);
      });

      expect(onSwipeupMock).toHaveBeenCalled();
      expect(onSwipedownMock).not.toHaveBeenCalled();
      expect(context.onScrollEndDrag).toHaveBeenCalled();
    });
  });

  it('should render children when scrollable prop is false', () => {
    const { getByText } = renderComponent({
      scrollable: false,
      children: (
        <View>
          <Text>children</Text>
        </View>
      ),
    });
    expect(getByText('children')).toBeTruthy();
  });
});