import React, { ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { screen, render } from '@testing-library/react-native';
import WmLinearlayout from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayout.component';
import WmLinearlayoutProps from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayout.props';
import WmLinearlayoutitem from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayoutitem/linearlayoutitem.component';
import { Platform } from 'react-native';
const defaultProps: WmLinearlayoutProps = {
  direction: 'row',
  horizontalalign: 'left',
  verticalalign: 'top',
  spacing: 0,
};

const renderComponent = (props = {}) => {
  return render(<WmLinearlayout {...defaultProps} {...props} />);
};

const getLinearLayoutItem = (props?: any) => {
  const defaultLinearLayoutItemProps = {
    children: [<Text key={1}>Item 1</Text>, <Text key={2}>Item 2</Text>],
    flexgrow: 0,
    flexshrink: 0,
  };
  return <WmLinearlayoutitem {...defaultLinearLayoutItemProps} {...props} />;
};

describe('Linear layout item tests', () => {
  it('should render linearlayoutitem without crashing', () => {
    const children = getLinearLayoutItem();
    const tree = renderComponent({ children });
    expect(tree).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('should render linearlayoutitem chidren', () => {
    const children = getLinearLayoutItem();
    const tree = renderComponent({ children });
    expect(tree.getByText('Item 1')).toBeTruthy();
    expect(tree.getByText('Item 2')).toBeTruthy();
  });

  it('should apply flexGrow correctly', () => {
    const children = getLinearLayoutItem({
      flexgrow: 1,
      flexshrink: undefined,
    });
    const tree = renderComponent({ children });
    const view: any = tree.toJSON();
    const flexGrow = view.children[0].props.style.flexGrow;
    expect(flexGrow).toBe(1);
  });

  it('should apply flexShrink correctly', () => {
    const children = getLinearLayoutItem({
      flexshrink: 1,
    });
    const tree = renderComponent({ children });
    const view: any = tree.toJSON();
    const flexShrink = view.children[0].props.style.flexShrink;
    expect(flexShrink).toBe(1);
  });

  it("flexBasis should be 'auto' when Platform.OS is web", () => {
    Platform.OS = 'web';
    let children = getLinearLayoutItem();
    const tree = renderComponent({ children });
    const view: any = tree.toJSON();
    const flexBasis = view.children[0].props.style.flexBasis;
    expect(flexBasis).toBe('auto');
  });

  it("flexBasis should be '0' when props.flexgrow is 1 and direction is row or row-reverse and Platform.OS is ios/android", () => {
    Platform.OS = 'ios';
    let children1 = getLinearLayoutItem({ flexgrow: 1 });
    const tree1 = renderComponent({ children: children1 });
    const view: any = tree1.toJSON();
    const flexBasis = view.children[0].props.style.flexBasis;
    expect(flexBasis).toBe(0);

    Platform.OS = 'android';
    const children2 = getLinearLayoutItem({ flexgrow: 1 });
    const tree2 = renderComponent({
      children: children2,
      direction: 'row-reverse',
    });
    const view1: any = tree2.toJSON();
    const flexBasis1 = view1.children[0].props.style.flexBasis;
    expect(flexBasis1).toBe(0);
  });
});
