import React, { ReactNode } from 'react';
import renderer from 'react-test-renderer';
import WmLinearlayout from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayout.component';
import WmLinearlayoutProps from '@wavemaker/app-rn-runtime/components/container/linearlayout/linearlayout.props';
import { screen, render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

describe('Test Linearlayout component', () => {
  const defaultProps: WmLinearlayoutProps = {
    direction: 'row',
    horizontalalign: 'left',
    verticalalign: 'top',
    spacing: 0,
  };

  const ALIGNMENT_MAP = {
    top: 'flex-start',
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    bottom: 'flex-end',
  } as any;

  const getChildren = (n: number = 3) => {
    const children = Array.from({ length: n }).map((_, index) => {
      return (
        <Text key={index} testID={`child-${index + 1}`}>
          {`Sample Text ${index + 1}`}
        </Text>
      );
    });
    return children;
  };

  const renderComponent = (props = {}) => {
    return render(<WmLinearlayout {...defaultProps} {...props} />);
  };

  it('renders correctly with default props', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).toBeTruthy();
    expect(tree.root.props.style).toBeTruthy();
  });

  it('should render children properly', () => {
    const children = (
      <View key="1" testID="child-1">
        <Text>Test Children</Text>
      </View>
    );
    const { getByTestId } = renderComponent({ children });
    expect(getByTestId('child-1')).toBeTruthy();
    expect(screen.getByText('Test Children')).toBeTruthy();
  });

  it('should render multiple children properly', () => {
    const children = [0, 1, 2, 3].map((item, index) => {
      return (
        <Text testID={`child-${index + 1}`}>{`Sample Text ${index + 1}`}</Text>
      );
    });
    const { getByTestId, getByText } = renderComponent({ children });
    children.map((item, index) => {
      expect(getByTestId(`child-${index + 1}`)).toBeTruthy();
      expect(getByText(`Sample Text ${index + 1}`)).toBeTruthy();
    });
  });

  it('should render the items in a horizontal row', () => {
    const children = getChildren();
    const tree = renderComponent({ children });
    expect(tree.root.props.style.flexDirection).toBe('row');
    children.map((item, index) => {
      expect(screen.toJSON().children[index].props.testID).toBe(
        `child-${index + 1}`
      );
      expect(screen.toJSON().children[index].children[0]).toBe(
        `Sample Text ${index + 1}`
      );
    });
  });

  it('should render the items in a vertical column', () => {
    const children = getChildren();
    const tree = renderComponent({ children, direction: 'column' });
    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.flexDirection).toBe('column');
    children.map((item, index) => {
      expect(screen.toJSON().children[index].props.testID).toBe(
        `child-${index + 1}`
      );
      expect(screen.toJSON().children[index].children[0]).toBe(
        `Sample Text ${index + 1}`
      );
    });
  });

  it('should render the items in a reversed horizontal row', () => {
    const children = getChildren();
    const tree = renderComponent({ children, direction: 'row-reverse' });
    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.flexDirection).toBe('row-reverse');
    children.map((item, index) => {
      expect(screen.toJSON().children[index].props.testID).toBe(
        `child-${index + 1}`
      );
      expect(screen.toJSON().children[index].children[0]).toBe(
        `Sample Text ${index + 1}`
      );
    });
  });

  it('should render the items in a reversed vertical column', () => {
    const children = getChildren();
    const tree = renderComponent({ children, direction: 'column-reverse' });
    expect(tree).toMatchSnapshot();
    expect(tree.root.props.style.flexDirection).toBe('column-reverse');
    children.map((item, index) => {
      expect(screen.toJSON().children[index].props.testID).toBe(
        `child-${index + 1}`
      );
      expect(screen.toJSON().children[index].children[0]).toBe(
        `Sample Text ${index + 1}`
      );
    });
  });

  it('should render the items in a horizontal row with horizontal align left,vertical align top', () => {
    const children = getChildren();
    const tree = renderComponent({
      children,
      direction: 'row',
      horizontalalign: 'left',
      verticalalign: 'top',
    });
    expect(tree.root.props.style.flexDirection).toBe('row');
    expect(tree.root.props.style.justifyContent).toBe('flex-start');
    expect(tree.root.props.style.alignItems).toBe('flex-start');
  });

  it('should render the items in a horizontal row with horizontal align left,vertical align top', () => {
    const children = getChildren();
    const directions: WmLinearlayoutProps['direction'][] = [
      'row',
      'row-reverse',
      'column',
      'column-reverse',
    ];
    const horizontalAlignments: WmLinearlayoutProps['horizontalalign'][] = [
      'left',
      'center',
      'right',
    ];
    const verticalAlignments: WmLinearlayoutProps['verticalalign'][] = [
      'top',
      'center',
      'bottom',
    ];

    directions.forEach((direction) => {
      horizontalAlignments.forEach((horizontalalign) => {
        verticalAlignments.forEach((verticalalign) => {
          const tree = renderComponent({
            children,
            direction: direction,
            horizontalalign: horizontalalign,
            verticalalign: verticalalign,
            spacing: 0,
          });

          expect(tree.root.props.style.flexDirection).toBe(direction);
          const isHorizontal = direction.startsWith('row');
          if (isHorizontal) {
            const justifyContent = ALIGNMENT_MAP[horizontalalign];
            const alignItems = ALIGNMENT_MAP[verticalalign];
            expect(tree.root.props.style.justifyContent).toBe(justifyContent);
            expect(tree.root.props.style.alignItems).toBe(alignItems);
          } else {
            const justifyContent = ALIGNMENT_MAP[verticalalign];
            const alignItems = ALIGNMENT_MAP[horizontalalign];
            expect(tree.root.props.style.justifyContent).toBe(justifyContent);
            expect(tree.root.props.style.alignItems).toBe(alignItems);
          }
        });
      });
    });
  });
});
