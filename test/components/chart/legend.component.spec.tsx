import React from 'react';
import { render } from '@testing-library/react-native';
import { Legend } from '@wavemaker/app-rn-runtime/components/chart/legend/legend.component';

describe('Legend Component', () => {
  const baseProps = {
    data: [
      { name: 'Category 1', color: 'red' },
      { name: 'Category 2', color: 'blue' },
      { name: 'Category 3', color: 'green' },
    ],
  };

  test('should render Legend component correctly', () => {
    const tree = render(<Legend {...baseProps} />);

    baseProps.data.forEach((item) => {
      expect(tree.getByText(item.name)).toBeTruthy();
    });
    expect(tree).toMatchSnapshot();
  });

  test('should render with vertical orientation', () => {
    const props = {
      ...baseProps,
      orientation: 'vertical',
    };
    const tree = render(<Legend {...props} />);

    expect(tree.toJSON().props.style[0]).toMatchObject({
      flexDirection: 'column',
      justifyContent: 'center',
    })
    expect(tree).toMatchSnapshot();
  });

  test('should render with horizontal orientation', () => {
    const props = {
      ...baseProps,
      orientation: 'horizontal',
    };
    const tree = render(<Legend {...props} />);

    expect(tree.toJSON().props.style[0]).toMatchObject({
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
    })
    expect(tree).toMatchSnapshot();
  });

  test('should apply custom dotStyle to legend dots', () => {
    const props = {
      ...baseProps,
      dotStyle: { borderRadius: 6 },
    };
    const { getByText } = render(<Legend {...props} />);

    props.data.forEach((item) => {
      const parentElement = getByText(item.name).parent?.parent;

      const siblingElementStyleArr = parentElement?.children[0].props.style;
      const style = {};
      siblingElementStyleArr.forEach(item => {
        if(!item) return;
        Object.keys(item).forEach(key => {
          style[key] = item[key]
        })
      })

      expect(style).toMatchObject({
        width: 12,
        height: 12,
        backgroundColor: item.color,
        borderRadius: 6,
      })
    });
  });

  test('should apply custom textStyle to legend text', () => {
    const props = {
      ...baseProps,
      testStyle: { fontSize: 16, color: 'purple' },
    };
    const { getByText } = render(<Legend {...props} />);

    props.data.forEach((item) => {
      const legendText = getByText(item.name);
      const styleArr = legendText.props.style;
      const style = {}

      styleArr.forEach(item => {
        if(!item) return;
        Object.keys(item).forEach(key => {
          style[key] = item[key]
        })
      })

      expect(style).toMatchObject({
        paddingLeft: 4,
        fontSize: 16,
        color: 'purple',
      })
    });
  });
});
