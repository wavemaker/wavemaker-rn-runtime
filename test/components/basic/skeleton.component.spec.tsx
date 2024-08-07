import React, { createRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import WmSkeleton, {
  createSkeleton,
} from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.component';
import WmSkeletonState from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.props';
import BASE_THEME, {
  ThemeProvider,
} from '@wavemaker/app-rn-runtime/styles/theme';
import {
  act,
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '@testing-library/react-native';
import { TestIdPrefixProvider } from '@wavemaker/app-rn-runtime/core/testid.provider';

const renderComponent = (props: WmSkeletonState = {}) => {
  return render(
    <TestIdPrefixProvider value={'wm-skeleton'}>
      <ThemeProvider value={BASE_THEME}>
        <WmSkeleton {...props} />
      </ThemeProvider>
    </TestIdPrefixProvider>
  );
};

describe('Test Skeleton component', () => {
  beforeAll(() => {
    jest.doMock('@wavemaker/app-rn-runtime/styles/theme');
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('should not visible when show prop is false', () => {
    const tree = renderComponent({
      show: false,
    });

    expect(tree.toJSON().props.style).toMatchObject({
      height: 0,
      width: 0,
    });
    expect(tree).toMatchSnapshot();
  });

  test('renders WmSkeleton correctly with default props', async () => {
    const testRef = createRef();
    const tree = renderComponent({
      ref: testRef,
    });
    testRef.current.skeletonloaderRef = {
      measure: (callback) => {
        callback(0, 0, 30, 30, 0, 0);
      },
    };

    fireEvent(tree.root, 'layout');

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(LinearGradient)).toBeDefined();
      expect(tree).toMatchSnapshot();
    });
  });

  test('should not render gradient component when animate state remains false: ', async () => {
    const testRef = createRef();
    const tree = renderComponent({
      ref: testRef,
    });

    await waitFor(() => {
      expect(tree).toMatchSnapshot();
      expect(tree.toJSON().children).toBeNull();
      expect(tree.UNSAFE_queryByType(LinearGradient)).toBeFalsy();
    });
  });

  test('renders WmSkeleton with custom layout', () => {
    const testRef = createRef();
    const customProps = {
      ref: testRef,
      styles: {
        root: {
          height: '100px',
          width: '125px',
        },
      },
    };
    const tree = renderComponent(customProps);

    testRef.current.skeletonloaderRef = {
      measure: (callback) => {
        callback(0, 0, 30, 30, 0, 0);
      },
    };

    fireEvent(tree.root, 'layout');

    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.width).toBe('125px');
    expect(tree.root.props.style.height).toBe('100px');
  });

  test('renders animated gradient correctly', () => {
    const testRef = createRef();
    const customProps = {
      ref: testRef,
    };
    const tree = renderComponent(customProps);

    testRef.current.skeletonloaderRef = {
      measure: (callback) => {
        callback(0, 0, 30, 30, 0, 0);
      },
    };

    fireEvent(tree.root, 'layout');

    const gradientElement = tree.UNSAFE_getByType(LinearGradient);
    expect(gradientElement).toBeTruthy();
  });

  test('applies custom styles to skeleton', () => {
    const testRef = createRef();
    const customStyles = {
      root: { backgroundColor: 'blue' },
      animatedView: { backgroundColor: 'red' },
      gradient: { borderColor: 'green' },
    };
    const tree = renderComponent({
      ref: testRef,
      styles: customStyles,
    });

    testRef.current.skeletonloaderRef = {
      measure: (callback) => {
        callback(0, 0, 30, 30, 0, 0);
      },
    };

    fireEvent(tree.root, 'layout');

    const skeletonElement = tree.toJSON();
    const animatedElement = skeletonElement.children[0];
    const gradientElementStyleArr =
      tree.UNSAFE_getByType(LinearGradient).props.style;
    const gradientElementStyle = {};
    gradientElementStyleArr.forEach((item) => {
      Object.keys(item).forEach((key) => {
        gradientElementStyle[key] = item[key];
      });
    });

    expect(tree).toMatchSnapshot();
    expect(skeletonElement.props.style).toMatchObject({
      backgroundColor: 'blue',
    });
    expect(animatedElement.props.style).toMatchObject({
      backgroundColor: 'red',
    });
    expect(gradientElementStyle).toMatchObject({
      backgroundColor: 'red',
      borderColor: 'green',
    });
  });

  test('createSkeleton function works correctly', () => {
    const skeletonStyles = {
      root: { backgroundColor: 'gray' },
    };

    const wrapper = {
      width: 100,
      height: 50,
      borderRadius: 10,
      marginTop: 5,
    };

    const style = createSkeleton(BASE_THEME, skeletonStyles, wrapper).props
      .styles;
    expect(style.root.width).toBe(100);
    expect(style.root.height).toBe(50);
    expect(style.root.borderRadius).toBe(10);
    expect(style.root.marginTop).toBe(5);
  });

  // test('animation runs correctly', () => {
  //   const tree = renderComponent();
  //   const animatedView = tree.getByTestId('animated-view');
  //   expect(animatedView).toHaveProperty(
  //     'props.style.transform[0].rotate',
  //     '-20deg'
  //   );
  // });

  // test('animation stops correctly', () => {
  //   const tree = renderComponent();
  //   tree.unmount();
  //   const animatedView = tree.getByTestId('animated-view');
  //   expect(animatedView.props.style.transform[0].translateX).toBeUndefined();
  // });
});
