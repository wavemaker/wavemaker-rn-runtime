import React from 'react';
import { View, Text } from 'react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import WmPage from '@wavemaker/app-rn-runtime/components//page/page.component';
import { render } from '@testing-library/react-native';
import {  SafeAreaProvider } from 'react-native-safe-area-context';
import WmPageProps from '@wavemaker/app-rn-runtime/components/page/page.props';

// Mock injector
jest.mock('@wavemaker/app-rn-runtime/core/injector', () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => ({
      edgeToEdgeConfig: {
        isEdgeToEdgeApp: false
      }
    })),
    I18nService: {
      get: jest.fn(() => ({
        getSelectedLocale: jest.fn(() => 'en'),
        isRTLLocale: jest.fn(() => false)
      }))
    }
  }
}));

const defaultProps = {
  name: 'test_Page',
  children: [],
  hasappnavbar: true,
  onscroll: '',
  barstyle: 'default',
  show:true
} as WmPageProps;


// Mock safe area provider context
jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: jest.fn().mockReturnValue({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaInsetsContext: {
      Consumer: ({ children }: any) => {
        return children({ top: 0, bottom: 0, left: 0, right: 0 });
      },
    }
  };
});

const renderComponent = (props = {}) => {
  return render(
    <SafeAreaProvider>
      <WmPage {...defaultProps} {...props} />
    </SafeAreaProvider>
  );
};

describe('Test Page component', () => {
  it('should render page component', async () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render page component with root styles', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();

    const { getByTestId } = renderComponent();
    const rootEle = getByTestId(/test_Page/);
    expect(rootEle).toBeTruthy();
    
    const componentStyles = rootEle.props.style;
    expect(componentStyles).toBeInstanceOf(Array);
    expect(componentStyles[1].flexDirection).toBe('column');
    expect(componentStyles[1].top).toBe(0);
    expect(componentStyles[1].left).toBe(0);
    expect(componentStyles[1].right).toBe(0);
    expect(componentStyles[1].bottom).toBe(0);
    expect(componentStyles[1].position).toBe('absolute');

    const newStyles = {
      root: {
        flexDirection: 'column',
        top: 10,
        left: 20,
        right: 30,
        bottom: 40,
        position: 'absolute',
      },
    };
    
    // Rerender with new styles
    const updatedTree = renderComponent({styles: newStyles});
    
    // Get the updated element after rerender
    const pageRoot = updatedTree.getByTestId(/test_Page/);
    const updatedStyles = pageRoot.props.style;
    console.log(updatedStyles,'updatedStyles')
    expect(updatedStyles).toBeInstanceOf(Array);
    expect(updatedStyles[1].flexDirection).toBe('column');
    expect(updatedStyles[1].top).toBe(10);
    expect(updatedStyles[1].left).toBe(20);
    expect(updatedStyles[1].right).toBe(30);
    expect(updatedStyles[1].bottom).toBe(40);
    expect(updatedStyles[1].position).toBe('absolute');
  });

  //background Component
  it('should render background Component', () => {
    const { UNSAFE_queryByType } = renderComponent();
    const viewEle = UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  //children
  it('should render children', () => {
    const tree = renderComponent(
      {
        children: [
          <View key="test">
            <Text>children</Text>
          </View>
        ]
      }
    );
    expect(tree.getByText('children')).toBeTruthy();
  })
});
