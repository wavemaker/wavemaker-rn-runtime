import React from 'react';
import { View, Text } from 'react-native';
import WmPartial from '@wavemaker/app-rn-runtime/components/page/partial/partial.component';
import { render } from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';

const renderComponent = (props = {}) => {
  return render(<WmPartial name="test_Page" {...props} />);
};

describe('Test Partial component', () => {
  it('should render partial component', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).not.toBeNull();
    expect(tree).toBeDefined();
  });

  it('should render partial component with root styles', () => {
    const tree = renderComponent();
    const rootEle = tree.root;
    expect(rootEle.props.style.width).toBe('100%');

    const styles = {
      root: {
        width: '50%',
      },
    };
    //rerender
    tree.rerender(<WmPartial name="test_Page" styles={styles} />);
    expect(rootEle.props.style.width).toBe('50%');
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
