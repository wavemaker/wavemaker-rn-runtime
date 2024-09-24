import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import WmLayoutgrid from '@wavemaker/app-rn-runtime/components/container/layoutgrid/layoutgrid.component';
import WmLayoutgridProps from '@wavemaker/app-rn-runtime/components/container/layoutgrid/layoutgrid.props';

const renderComponent = (props?: WmLayoutgridProps | any) => {
  return render(
    <WmLayoutgrid id="layoutgrid" {...props}>
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

    expect(tree.getByTestId('layoutgrid')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('renders root styles', () => {
    const tree = renderComponent();
    const rootEle = tree.root;
    expect(rootEle.props.style.flexDirection).toBe('column');
    expect(rootEle.props.style.width).toBe('100%');
  });

  it('renders background component', () => {
    const tree = renderComponent();
    const viewEle = tree.UNSAFE_queryByType(BackgroundComponent);
    expect(viewEle).not.toBeNull();
    expect(viewEle).toBeDefined();
  });

  it('should render a skeleton with given width and height', () => {
    const tree = renderComponent({
      showskeleton: true,
      skeletonheight: '100',
      skeletonwidth: '50',
    });

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
