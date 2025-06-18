import React, { createRef } from 'react';
import { Text, View, Dimensions, Platform } from 'react-native';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import WmBottomsheet from '@wavemaker/app-rn-runtime/components/basic/bottomsheet/bottomsheet.component';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

// Mock BackHandler
const mockBackHandler = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};
jest.mock('react-native/Libraries/Utilities/BackHandler', () => mockBackHandler);

// Mock StatusBar
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => ({
  currentHeight: 24,
}));

const renderComponent = (props: any = {}) => {
  const defaultProps = {
    id: 'test-bottomsheet',
    visible: true,
    sheetheightratio: 0.5,
    expandedheightratio: 0.8,
    shouldexpand: true,
    keyboardverticaloffset: 0,
  };
  const loadAsset = (path: string) => path;

  return render(
    <AssetProvider value={loadAsset}>
      <WmBottomsheet {...defaultProps} {...props} />
    </AssetProvider>
  );
};

const ChildrenComponent = () => (
  <View>
    <Text>Bottom Sheet Content</Text>
  </View>
);

// Mock Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.Value = jest.fn(() => ({
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  return RN;
});

describe('Test Bottomsheet component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios'; // Default to iOS
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });


  test('should match snapshot with default props', () => {
    const tree = renderer.create(
      <AssetProvider value={(path: string) => path}>
        <WmBottomsheet
          id="test-bottomsheet"
          visible={true}
          sheetheightratio={0.5}
          expandedheightratio={0.8}
          shouldexpand={true}
          keyboardverticaloffset={0}
        >
          <ChildrenComponent />
        </WmBottomsheet>
      </AssetProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('should render with default props', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('test-bottomsheet_keyboardview')).toBeTruthy();
  });

  test('should not render when visible is false', () => {
    const { queryByTestId } = renderComponent({ visible: false });
    expect(queryByTestId('test-bottomsheet_keyboardview')).toBeNull();
  });

  test('should open bottom sheet when visible is true', async () => {
    const customRef = createRef<WmBottomsheet>();
    const onOpenedMock = jest.fn();
    renderComponent({ ref: customRef, visible: false, onOpened: onOpenedMock });
    
    act(() => {
      customRef.current?.onPropertyChange('visible', true, false);
    });
    
    // Wait for the state to update and animation to be triggered
    await waitFor(() => {
      expect(customRef.current?.state.isBottomsheetVisible).toBe(true);
    });
    
   // expect(require('react-native').Animated.parallel).toHaveBeenCalled();
  });

  test('should close sheet with animation when backdrop is pressed', async () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = renderComponent({ onClose: onCloseMock });
    
    fireEvent.press(getByTestId('test-bottomsheet_backdrop'));
    
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
  });

  test('should close sheet when drag handle is pressed', async () => {
    const customRef = createRef<WmBottomsheet>();
    const onCloseMock = jest.fn();
    const { getByTestId } = renderComponent({ ref: customRef, onClose: onCloseMock });
    
    fireEvent.press(getByTestId('test-bottomsheet_draghandle'));
    
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  test('should handle swipe down gesture to close sheet', async () => {
    const customRef = createRef<WmBottomsheet>();
    const onCloseMock = jest.fn();
    renderComponent({ ref: customRef, onClose: onCloseMock });
    
    // Mock gesture state for significant downward swipe
    const gestureState = {
      dy: 150, // Above threshold
      vy: 0.6, // Above velocity threshold
      stateID: 1,
      moveX: 0,
      moveY: 150,
      x0: 0,
      y0: 0,
      dx: 0,
      vx: 0,
      numberActiveTouches: 1,
      _accountsForMovesUpTo: 1
    };
    
    act(() => {
      customRef.current?.handleSwipeGesture(gestureState);
    });
    
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  

  test('should expand sheet when swiping up', () => {
    const customRef = createRef<WmBottomsheet>();
    renderComponent({ ref: customRef });

    // Mock gesture state for upward swipe
    const gestureState = {
      dy: -100, // Upward swipe
      vy: -0.5,
      stateID: 1,
      moveX: 0,
      moveY: -100,
      x0: 0,
      y0: 0,
      dx: 0,
      vx: 0,
      numberActiveTouches: 1,
      _accountsForMovesUpTo: 1
    };

    act(() => {
      customRef.current?.handleSwipeGesture(gestureState);
    });

    expect(require('react-native').Animated.timing).toHaveBeenCalled();
  });

  

  test('should handle minimum height ratio correctly', () => {
    const customRef = createRef<WmBottomsheet>();
    const sheetheightratio = 0.1; // Below minimum
    renderComponent({ ref: customRef, sheetheightratio });

    // Get the animated value for sheet height
    const animatedValue = customRef.current?.state.sheetHeight;
    const expectedHeight = SCREEN_HEIGHT * 0.2; // Minimum height is 20% of screen height

    // Verify the animated value was set correctly
    expect(animatedValue?.setValue).toHaveBeenCalledWith(expectedHeight);
  });

  test('should render children inside the bottom sheet', () => {
    const { getByText, getByTestId } = renderComponent({
      children: <ChildrenComponent />
    });
    
    // Verify the content container exists
    expect(getByTestId('test-bottomsheet_scorllview')).toBeTruthy();
    // Verify the child component is rendered
    expect(getByText('Bottom Sheet Content')).toBeTruthy();
  });

  test('should return to original height when swipe down is below threshold', () => {
    const customRef = createRef<WmBottomsheet>();
    renderComponent({ ref: customRef });

    // First expand the sheet
    const expandGestureState = {
      dy: -100, // Upward swipe
      vy: -0.5,
      stateID: 1,
      moveX: 0,
      moveY: -100,
      x0: 0,
      y0: 0,
      dx: 0,
      vx: 0,
      numberActiveTouches: 1,
      _accountsForMovesUpTo: 1
    };

    act(() => {
      customRef.current?.handleSwipeGesture(expandGestureState);
    });

    // Now swipe down but below threshold (less than 25% of expanded height)
    const swipeDownGestureState = {
      dy: 50, // Small downward swipe
      vy: 0.2,
      stateID: 1,
      moveX: 0,
      moveY: 50,
      x0: 0,
      y0: 0,
      dx: 0,
      vx: 0,
      numberActiveTouches: 1,
      _accountsForMovesUpTo: 1
    };

    act(() => {
      customRef.current?.handleSwipeGesture(swipeDownGestureState);
    });

    // Verify that the sheet returns to original height
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
    expect(customRef.current?.state.isExpanded).toBe(false);
  });

  test('should open bottom sheet when open() method is called', async () => {
    const customRef = createRef<WmBottomsheet>();
    const onOpenedMock = jest.fn();
    renderComponent({ ref: customRef, visible: false, onOpened: onOpenedMock });

    // Initially the bottom sheet should not be visible
    expect(customRef.current?.state.isBottomsheetVisible).toBe(false);

    // Call the open() method
    act(() => {
      customRef.current?.open();
    });

    // Wait for the state to update and animation to be triggered
    await waitFor(() => {
      expect(customRef.current?.state.isBottomsheetVisible).toBe(true);
    });
    
    // Verify that openSheet animation is triggered
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
    
    // Verify that onOpened callback is triggered after animation
    await waitFor(() => {
      expect(onOpenedMock).toHaveBeenCalled();
    });
  });

  test('should close bottom sheet when close() method is called', async () => {
    const customRef = createRef<WmBottomsheet>();
    const onCloseMock = jest.fn();
    renderComponent({ ref: customRef, onClose: onCloseMock });

    // Initially the bottom sheet should be visible
    expect(customRef.current?.state.isBottomsheetVisible).toBe(true);

    // Call the close() method
    act(() => {
      customRef.current?.close();
    });

    // Verify that closeSheet animation is triggered
    expect(require('react-native').Animated.parallel).toHaveBeenCalled();
    
    // Wait for the animation to complete and callback to be triggered
    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

});