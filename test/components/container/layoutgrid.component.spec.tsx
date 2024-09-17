import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import WmLayoutgrid from '@wavemaker/app-rn-runtime/components/container/layoutgrid/layoutgrid.component';
import WmLayoutgridProps from '@wavemaker/app-rn-runtime/components/container/layoutgrid/layoutgrid.props';

const renderComponent = (props?: WmLayoutgridProps) => {
  return render(
    <WmLayoutgrid>
      {props?.children}
    </WmLayoutgrid>
  );
};

const ChildComponent = () => (
  <View>
    <Text>Child Component</Text>
  </View>
);

describe('Test Layoutgrid component', () => {
  test('renders layout grid properly', () => {
    const tree = renderComponent({children: null});

    expect(tree.getByTestId('wm-layoutgrid')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    const props = {
      children: <ChildComponent />
    }
    const tree = renderComponent(props);

    expect(tree.getByText('Child Component')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
