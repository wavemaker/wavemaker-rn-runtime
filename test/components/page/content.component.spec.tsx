import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WmContent from '@wavemaker/app-rn-runtime/components/page/content/content.component';
import { render, screen } from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

const renderComponent = (props = {}) => {
  return render(<WmContent name="test_Navbar" {...props} />);
};

describe('Test Content component', () => {
  it('should render the content component', () => {
    const tree = renderComponent().toJSON();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render the root element with styles', () => {
    const styles = {
      root: {
        flex: 3,
      },
      text: {},
    };
    const tree = renderComponent();
    const viewEle = screen.root;
    expect(viewEle).toBeDefined();
    expect(viewEle.props.style.flex).toBe(1); //default styles
    tree.rerender(<WmContent name="test_Navbar" styles={styles} />);
    expect(viewEle.props.style.flex).toBe(3); //custom styles
  });

  it('should render the background Component', () => {
    const tree = renderComponent();
    const viewEle = tree.UNSAFE_getByType(BackgroundComponent);
    expect(viewEle).toBeDefined();
  });

  it('should render the component with children', () => {
    const tree = renderComponent({
      children: (
        <View>
          <Text>content Component</Text>
        </View>
      ),
    });
    expect(tree.getByText('content Component')).toBeTruthy();
  });
});
