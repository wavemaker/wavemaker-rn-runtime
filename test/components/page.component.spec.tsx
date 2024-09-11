import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import WmPage from '@wavemaker/app-rn-runtime/components//page/page.component';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';

const renderComponent = (props = {}) => {
  return render(<WmPage name="test_Page" {...props} />);
};

describe('Test Page component', () => {
  it('should render page component', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render page component with root styles', () => {
    const tree = renderComponent();
    const rootEle = tree.root;
    expect(rootEle.props.style.flexDirection).toBe('column');
    expect(rootEle.props.style.top).toBe(0);
    expect(rootEle.props.style.left).toBe(0);
    expect(rootEle.props.style.right).toBe(0);
    expect(rootEle.props.style.bottom).toBe(0);
    expect(rootEle.props.style.position).toBe('absolute');

    const styles = {
      root: {
        flexDirection: 'column',
        top: 10,
        left: 20,
        right: 30,
        bottom: 40,
        position: 'absolute',
      },
    };
    //rerender
    tree.rerender(<WmPage name="test_Page" styles={styles} />);
    expect(rootEle.props.style.flexDirection).toBe('column');
    expect(rootEle.props.style.top).toBe(10);
    expect(rootEle.props.style.left).toBe(20);
    expect(rootEle.props.style.right).toBe(30);
    expect(rootEle.props.style.bottom).toBe(40);
    expect(rootEle.props.style.position).toBe('absolute');
  });

  //background Component
  it('should render background Component', () => {
    const tree = renderComponent();
    const viewEle = tree.UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  //children
  it('should render children', () => {
    const tree = renderComponent({
      children: (
        <View>
          <Text>children</Text>
        </View>
      ),
    });
    expect(tree.getByText('children')).toBeTruthy();
  });
});
