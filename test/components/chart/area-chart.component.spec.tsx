import React, { ReactNode, createRef } from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
import WmAreaChart from '@wavemaker/app-rn-runtime/components/chart/area-chart/area-chart.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import {
  VictoryAxis,
  VictoryArea,
  VictoryChart,
  VictoryLegend,
  VictoryScatter,
} from 'victory-native';

const renderComponent = (props = {}) => {
  return render(<WmAreaChart {...props} name="test_AreaChart" />);
};
const dataSet = [
  {
    x: 5,
    y: 10,
  },
  {
    x: 15,
    y: 20,
  },
  {
    x: 25,
    y: 30,
  },
];
const defaultProps = { dataset: dataSet, xaxisdatakey: 'x', yaxisdatakey: 'y' };

describe('Test AreaChart component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  //should render when default props are given and also shouldnot render when default props are not given
  it('Should render component', () => {
    const tree = renderComponent(defaultProps);
    expect(Array.isArray(tree.toJSON())).toBe(true);
    expect(tree.toJSON()[1]).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  it('should render with null when props are not given', () => {
    const tree = renderComponent();
    expect(Array.isArray(tree.toJSON())).toBe(false);
    expect(tree.toJSON().children).toBeNull();
  });

  //title, titlesIcon subheading
  it('should render title', () => {
    const { getByText } = renderComponent({
      title: 'Area Chart',
      ...defaultProps,
      styles: {
        title: {
          color: 'red',
          fontSize: 30,
          lineHeight: 10,
          paddingLeft: 20,
        },
        text: {
          color: 'yellow',
        },
      },
    });
    expect(getByText('Area Chart')).toBeTruthy();
    expect(getByText('Area Chart').props.style.color).toBe('red');
    expect(getByText('Area Chart').props.style.fontSize).toBe(30);
    expect(getByText('Area Chart').props.style.lineHeight).toBe(10);
    expect(getByText('Area Chart').props.style.paddingLeft).toBe(20);
  });

  it('should render Icon when iconclass is provided', () => {
    const tree = renderComponent({
      ...defaultProps,
      iconclass: 'fa fa-edit',
      styles: {
        icon: {
          icon: {
            fontSize: 40,
          },
        },
        text: {
          color: 'red',
        },
      },
    });
    expect(tree.getByText('edit')).toBeTruthy();
    expect(tree.getByText('edit').props.style[1].fontSize).toBe(40);
  });

  it('should not render  Icon when iconclass is not provided', () => {
    const tree = renderComponent({ ...defaultProps });
    const wmIcon = tree.UNSAFE_queryByType(WmIcon);
    expect(wmIcon).toBeNull();
  });

  it('should render subheading', () => {
    const { getByText } = renderComponent({
      subheading: 'subHeading-Area Chart',
      ...defaultProps,
      styles: {
        subHeading: {
          fontSize: 20,
          lineHeight: 30,
          color: 'red',
        },
        text: {
          color: 'pink',
        },
      },
    });
    const text = getByText('subHeading-Area Chart');
    expect(text).toBeTruthy();
    expect(text.props.style.fontSize).toBe(20);
    expect(text.props.style.lineHeight).toBe(30);
    expect(text.props.style.color).toBe('red');
  });
  it('should not render title when title prop is not provided', () => {
    const { queryByText } = renderComponent({
      ...defaultProps,
      // title is intentionally not provided
      subheading: 'Only Subheading'
    });
    
    // Title section should not be rendered
    expect(queryByText('Area Chart')).toBeNull();
    
    // Subheading should be rendered
    expect(queryByText('Only Subheading')).toBeTruthy();
  });
  
  it('should not render subheading when subheading prop is not provided', () => {
    const { queryByText } = renderComponent({
      ...defaultProps,
      title: 'Only Title',
      // subheading is intentionally not provided
    });
    
    // Title should be rendered
    expect(queryByText('Only Title')).toBeTruthy();
    
    // Subheading should not be rendered
    expect(queryByText('subHeading-Area Chart')).toBeNull();
  });
  
  it('should render both title and subheading when both props are provided', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      title: 'Custom Title',
      subheading: 'Custom Subheading'
    });
    
    // Both title and subheading should be rendered
    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom Subheading')).toBeTruthy();
  });

  // events - onBeforerender and onTransform
  it('should call onBeforerender and onTransform events', () => {
    const onBeforeRenderMock = jest.fn();
    const onTransformMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmAreaChart.prototype,
      'invokeEventCallback'
    );
    renderComponent({
      ...defaultProps,
      onBeforerender: onBeforeRenderMock,
      onTransform: onTransformMock,
    });
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onBeforerender',
      expect.anything()
    );
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onTransform',
      expect.anything()
    );
    expect(onBeforeRenderMock).toHaveBeenCalledTimes(1);
    expect(onTransformMock).toHaveBeenCalledTimes(1);
  });

  // on select
  it('should call onSelect event', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmAreaChart.prototype,
      'invokeEventCallback'
    );

    const customRef = createRef<WmAreaChart>();
    renderComponent({
      ...defaultProps,
      offsetX: 10,
      locationX: 14,
      offsetY: 20,
      locationY: 25,
      ref: customRef,
      tooltipXaxis: 1,
      tooltipYaxis: 1,
      isTooltipOpen: false,
    });
    const onSelect = {
      nativeEvent: {
        offsetX: 10,
        locationX: 14,
        offsetY: 20,
        locationY: 25,
      },
    };
    const dataSet1 = {
      data: [{ x: 10, y: 20, z: 30 }],
      datum: {
        x: 10,
        y: 20,
        z: 30,
      },
      index: 0,
    };
    act(() => {
      customRef.current.onSelect(onSelect, dataSet1);
    });

    await waitFor(() => {
      expect(invokeEventCallbackMock).toHaveBeenCalledWith(
        'onSelect',
        expect.anything()
      );
    });
  });

  // Accessiility
  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      ...defaultProps,
      accessibilitylabel: 'Button',
      accessibilityrole: 'Button',
      hint: 'test button',
      styles: {
        root: {
          backgroundColor: 'red',
          width: 200,
          height: 300,
        },
        text: {
          color: 'red',
        },
      },
    });
    expect(getByLabelText('Button')).toBeTruthy();
    expect(getByRole('Button')).toBeTruthy();
    expect(getByA11yHint('test button')).toBeTruthy();
    expect(getByRole('Button').props.style.backgroundColor).toBe('red');
    expect(getByRole('Button').props.style.width).toBe(200);
    expect(getByRole('Button').props.style.height).toBe(300);
  });

  //when width was updated or set
  it('should render chart when width state is updated', () => {
    const tree = renderComponent({ ...defaultProps });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    const viewEle = tree.UNSAFE_queryByType(VictoryChart);
    expect(viewEle).toBeDefined();
  });

  it('should not render chart when width state is not updated', () => {
    const tree = renderComponent({ ...defaultProps });
    const victoryChart = tree.UNSAFE_queryByType(VictoryChart);
    expect(victoryChart).toBeNull;
  });

  //show - false
  it('should have width and height to be 0 when show is false', () => {
    const { getByRole } = renderComponent({
      ...defaultProps,
      show: false,
      accessibilityrole: 'AREACHART',
    });
    const viewEle = getByRole('AREACHART');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  //victory charts
  it('should render victorycharts with offset', async () => {
    const tree = renderComponent({
      ...defaultProps,
      ydomain: 'Min',
      xdomain: 'Min',
      type: 'Area',
      offsettop: 10,
      offsetbottom: 20,
      offsetright: 30,
      offsetleft: 40,
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    
    const viewEle = tree.UNSAFE_getByType(VictoryChart);

    await waitFor(() => {
      // expect(viewEle.props.minDomain).toBe();
      expect(viewEle.props.padding.top).toBe(10);
      expect(viewEle.props.padding.bottom).toBe(20);
      expect(viewEle.props.padding.right).toBe(30);
      expect(viewEle.props.padding.left).toBe(40);
    });
  });

  it('mindomain is undefined', async () => {
    const tree = renderComponent({
      ...defaultProps,
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    const viewEle = tree.UNSAFE_getByType(VictoryChart);

    await waitFor(() => {
      expect(viewEle.props.minDomain.x).toBe(undefined);
      expect(viewEle.props.minDomain.y).toBe(undefined);
    });
  });

  //victoryArea
  it('should render victoryArea with linethickness, colorscale, interpolation, styles-strokewidth ', async () => {
    const colorScale = ['red', 'yellow', 'green'];
    const linethickValue = 5;
    const tree = renderComponent({
      ...defaultProps,
      linethickness: linethickValue,
      customcolors: colorScale,
    });

    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryArea);
      expect(viewEle.props.interpolation).toBe('linear');
      expect(viewEle.props.style.data.strokeWidth).toBe(linethickValue);
      expect(viewEle.props.style.data.stroke).toBe(colorScale[0]);
      expect(viewEle.props.data[0].y).toBe(10);
    });

    tree.rerender(
      <WmAreaChart
        {...defaultProps}
        name="test_AreaChart"
        interpolation="cardinal"
      />
    );
    await waitFor(() => {
      const victoryAreaEle = tree.UNSAFE_getByType(VictoryArea);
      expect(victoryAreaEle.props.interpolation).toBe('cardinal');
    });

    tree.rerender(
      <WmAreaChart
        {...defaultProps}
        name="test_AreaChart"
        interpolation="step"
      />
    );
    await waitFor(() => {
      const victoryAreaEle = tree.UNSAFE_getByType(VictoryArea);
      expect(victoryAreaEle.props.interpolation).toBe('step');
    });
  });

  //victoryScatter
  it('should render VictoryScatter with colorScale and highlightpoints', async () => {
    const colorScale = ['red', 'yellow', 'green'];
    const tree = renderComponent({
      ...defaultProps,
      customcolors: colorScale,
      highlightpoints: true,
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryScatter);
      expect(viewEle.props.style.data.opacity).toBe(0.8);
      expect(viewEle.props.style.data.fill).toBe(colorScale[0]);
    });
    tree.rerender(
      <WmAreaChart
        {...defaultProps}
        name="test_AreaChart"
        highlightpoints={false}
      />
    );
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryScatter);
      expect(viewEle.props.style.data.fill).toBe(colorScale[0]);
      expect(viewEle.props.style.data.opacity).toBe(0);
    });
  });

  it('Advanced Settings-VictoryAxis', async () => {
    const tree = renderComponent({
      ...defaultProps,
      xaxislabel: 'x',
      xunits: 'cm',
      showxdistance: 'true',
      yaxislabel: 'y',
      yunits: 'cm',
      yaxislabeldistance: 2,
      showydistance: 'true',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getAllByType(VictoryAxis);
      expect(viewEle[0].props.label).toBe('x(cm)');
      expect(viewEle[1].props.label).toBe('y(cm)');
    });
  });

  //tooltip
  it('should render get tooltip ', async () => {
    const getTooltipMock = jest.spyOn(WmAreaChart.prototype, 'getTooltip');
    const customRef = createRef<WmAreaChart>();
    const { getByText } = renderComponent({
      ...defaultProps,
      caption: 'newcaption',
      ref: customRef,
    });
    expect(getTooltipMock).toHaveBeenCalledTimes(1);
    expect(getTooltipMock).toHaveReturnedWith(null);

    const event = {
      nativeEvent: {
        offsetX: 10,
        locationX: 14,
        offsetY: 20,
        locationY: 25,
      },
    };
    const dataSet1 = {
      data: [{ x: 10, y: 20, z: 30 }],
      datum: {
        x: 0,
        y: 1,
        z: 2,
      },
      index: 0,
    };
    act(() => {
      customRef.current.onSelect(event, dataSet1);
    });
    await waitFor(() => {
      expect(customRef.current.state.isTooltipOpen).toBe(true);
      expect(getTooltipMock).not.toBeNull();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });
  });

  //legend
  it('showlegend set to hidden', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'hide',
      colorScale: ['red', 'yellow', 'green'],
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      expect(tree.UNSAFE_queryByType(VictoryLegend)).toBeFalsy();
    });
  });

  it('showlegend except hidden like showlegend as top,left,right', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'top',
      colorScale: ['red', 'yellow', 'green'],
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      expect(tree.UNSAFE_getByType(VictoryLegend)).toBeDefined();
    });
  });

  //theme
  it('should render theme', async () => {
    const tree = renderComponent({
      ...defaultProps,
      theme: 'Annabelle',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    const viewEle1 = tree.UNSAFE_getByType(VictoryChart);

    await waitFor(() => {
      expect(viewEle1.props.theme.group.colorScale[0]).toBe('#393b79');
      expect(viewEle1.props.theme.group.width).toBe(250);
      expect(viewEle1.props.theme.group.height).toBe(250);
      expect(viewEle1.props.theme.legend.colorScale[0]).toBe('#393b79');
      expect(viewEle1.props.theme.legend.orientation).toBe('vertical');
      expect(viewEle1.props.theme.legend.gutter).toBe(10);
    });
  });

  //showxaxis , showyaxis
  xit('showxaxis', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showxaxis: false,
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      expect(tree.UNSAFE_getAllByType(VictoryAxis).length).toBe(1);
    });
  });

  it('showyaxis', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showyaxis: false,
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      expect(tree.UNSAFE_getAllByType(VictoryAxis).length).toBe(1);
    });
  });
});
