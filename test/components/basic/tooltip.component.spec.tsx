import React from 'react';
import { Text } from 'react-native';
import WmTooltip, {
  WmTooltipStyles,
} from '@wavemaker/app-rn-runtime/components/basic/tooltip/tooltip.component';
import { render } from '@testing-library/react-native';

const renderComponent = (props = {}) => {
  const defaultProps = {
    name: 'wm-tooltip',
    id: 'test-tooltip',
    text: 'Tooltip Text',
    showTooltip: true,
    direction: 'up',
    tooltipStyle: {},
    tooltipLabelStyle: {},
    tooltipTriangleStyle: {},
    children: <Text>Hover over me</Text>,
  };
  return render(<WmTooltip {...defaultProps} {...props} />);
};

describe('WmTooltip component', () => {
  test('should render the WmTooltip correctly with given props', () => {
    const tree = renderComponent();

    expect(tree.getByText('Tooltip Text')).toBeTruthy();
    expect(tree.getByText('Hover over me')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('renders the tooltip in the correct direction - up', () => {
    const tree = renderComponent({ direction: 'up' });

    expect(tree.toJSON().children[0].props.style).toMatchObject({ top: -60 });
    expect(tree).toMatchSnapshot();
  });

  test('renders the tooltip in the correct direction - down', () => {
    const tree = renderComponent({ direction: 'down' });

    expect(tree.toJSON().children[0].props.style).toMatchObject({
      bottom: -40,
    });
    expect(tree).toMatchSnapshot();
  });

  test('renders the tooltip in the correct direction - left', () => {
    const tree = renderComponent({ direction: 'left' });

    expect(tree.toJSON().children[0].props.style).toMatchObject({ left: -40 });
    expect(tree).toMatchSnapshot();
  });

  test('renders the tooltip in the correct direction - right', () => {
    const tree = renderComponent({ direction: 'right' });

    expect(tree.toJSON().children[0].props.style).toMatchObject({ right: -40 });
    expect(tree).toMatchSnapshot();
  });

  test('handles tooltipStyle property correctly', () => {
    const tooltipStyle = { backgroundColor: 'red', padding: 15 };
    const tree = renderComponent({ tooltipStyle });

    expect(tree.toJSON().children[0].props.style).toEqual(
      expect.objectContaining(tooltipStyle)
    );
    expect(tree.toJSON().children[0].children[1].props.style).toContainEqual(
      expect.objectContaining({
        borderBottomColor: tooltipStyle.backgroundColor,
      })
    );
    expect(tree).toMatchSnapshot();
  });

  test('handles tooltipLabelStyle property correctly', () => {
    const tooltipLabelStyle = { color: 'blue', fontSize: 18 };
    const tree = renderComponent({ tooltipLabelStyle });
    const tooltipText = tree.getByText('Tooltip Text');

    expect(tooltipText.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(tooltipLabelStyle)])
    );
    expect(tree).toMatchSnapshot();
  });

  test('handles tooltipTriangleStyle property correctly', () => {
    const tooltipTriangleStyle = { borderBottomColor: 'green' };
    const tree = renderComponent({ tooltipTriangleStyle });
    const triangleComponent = tree.toJSON().children[0].children[1];

    expect(triangleComponent.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(tooltipTriangleStyle)])
    );
    expect(tree).toMatchSnapshot();
  });

  test('does not render tooltip when showTooltip is false', () => {
    const tree = renderComponent({ showTooltip: false });

    expect(tree.queryByText('Tooltip Text')).toBeNull();
    expect(tree).toMatchSnapshot();
  });

  test('should apply the style prop correctly', () => {
    const themeTooltipStyle = {
      root: {
        backgroundColor: 'pink',
      },
      tooltip: {
        backgroundColor: 'yellow',
      },
      triangle: {
        backgroundColor: 'purple',
      },
    } as WmTooltipStyles;

    const tree = renderComponent({ styles: themeTooltipStyle });
    const triangleComponentStyleArr =
      tree.toJSON().children[0].children[1].props.style;
    const triangleComponentStyle = {};
    triangleComponentStyleArr.forEach((item) => {
      Object.keys(item).forEach((key) => {
        triangleComponentStyle[key] = item[key];
      });
    });

    expect(tree.toJSON().props.style).toMatchObject({
      backgroundColor: 'pink',
    });
    expect(triangleComponentStyle).toMatchObject({
      backgroundColor: 'purple',
      borderBottomColor: 'yellow',
    });
    expect(tree).toMatchSnapshot();
  });

  test('renders children correctly', () => {
    const tree = renderComponent({ children: <Text>Test Children</Text> });

    expect(tree.getByText('Test Children')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  test('should render the component with style "top: -60" when direction prop is falsy', () => {
    const tree = renderComponent({
      direction: '',
    });

    expect(tree.toJSON().children[0].props.style).toMatchObject({ top: -60 });
    expect(tree).toMatchSnapshot();
  });

  test('should rotate the triangle component to 180deg when direction prop is falsy', () => {
    const tree = renderComponent({
      direction: '',
    });
    const triangleComponentStyleArr =
      tree.toJSON().children[0].children[1].props.style;
    const triangleComponentStyle = {};
    triangleComponentStyleArr.forEach((item) => {
      Object.keys(item).forEach((key) => {
        triangleComponentStyle[key] = item[key];
      });
    });

    expect(triangleComponentStyle).toMatchObject({
      transform: [{ rotate: '180deg' }],
    });
    expect(tree).toMatchSnapshot();
  });

  test('the triangle component should have style property "bottom: -10" when direction prop is falsy', () => {
    const tree = renderComponent({
      direction: '',
    });
    const triangleComponentStyleArr =
      tree.toJSON().children[0].children[1].props.style;
    const triangleComponentStyle = {};
    triangleComponentStyleArr.forEach((item) => {
      Object.keys(item).forEach((key) => {
        triangleComponentStyle[key] = item[key];
      });
    });

    expect(triangleComponentStyle).toMatchObject({
      bottom: -10,
    });
    expect(tree).toMatchSnapshot();
  });
});
