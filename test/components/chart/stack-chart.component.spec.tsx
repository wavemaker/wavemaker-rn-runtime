import React, { ReactNode, createRef } from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
import { Svg } from 'react-native-svg';
import WmStackChart from '@wavemaker/app-rn-runtime/components/chart/stack-chart/stack-chart.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryStack,
  VictoryPie,
} from 'victory-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const renderComponent = (props = {}) => {
  return render(<WmStackChart {...props} name="test_StackChart" />);
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
const defaultProps = { dataset: dataSet, xaxisdatakey: 'x', yaxisdatakey: 'y', hint: 'stack chart' };

describe('Test stackChart component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('Should render component', () => {
    const tree = renderComponent(defaultProps);
    expect(tree.toJSON()).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  it('should render with null when props are not given', () => {
    const tree = renderComponent();
    expect(Array.isArray(tree.toJSON())).toBe(false);
    expect(tree.toJSON().children).toBeNull();
  });

  //events - onBeforerender onTransform
  it('should call onBeforerender and onTransform events', () => {
    const onBeforeRenderMock = jest.fn();
    const onTransformMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmStackChart.prototype,
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
      WmStackChart.prototype,
      'invokeEventCallback'
    );

    const customRef = createRef<WmStackChart>();
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
        index: 0,
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

  //acessibility
  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      ...defaultProps,
      accessibilitylabel: 'Button',
      accessibilityrole: 'Button',
      hint: 'test button',
    });
    expect(getByLabelText('Button')).toBeTruthy();
    expect(getByRole('Button')).toBeTruthy();
    expect(getByA11yHint('test button')).toBeTruthy();
  });

  //tooltip
  it('should render get tooltip ', async () => {
    const getTooltipMock = jest.spyOn(WmStackChart.prototype, 'getTooltip');
    const customRef = createRef<WmStackChart>();
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
        index: 0,
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
      expect(getByText('10')).toBeTruthy();
    });
  });

  //victory charts starts here

  //victory chart
  it('should render victoryChart with offsetValues, when width was set', async () => {
    const tree = renderComponent({
      ...defaultProps,
      offsettop: 10,
      offsetbottom: 10,
      offsetleft: 10,
      offsetright: 10,
    });

    const root = screen.getByAccessibilityHint(defaultProps.hint);

    fireEvent(root, 'layout', {
      nativeEvent: {
        layout: {
          width: 250,
        },
      },
    });
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryChart);
      expect(viewEle.props.padding.top).toBe(10);
      expect(viewEle.props.padding.bottom).toBe(10);
      expect(viewEle.props.padding.left).toBe(10);
      expect(viewEle.props.padding.right).toBe(10);
      expect(viewEle.props.width).toBe(250);
    });
  });

  it('should render victoryChart with respect to default width as 200', async () => {
    const tree = renderComponent({
      ...defaultProps,
    });
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryChart);
      expect(viewEle.props.width).toBe(200);
    });
  });

  it('should render victoryChart with width and height with respect to rootStyles', () => {
    const tree = renderComponent({
      ...defaultProps,
      styles: {
        root: {
          width: 300,
        },
        text: {
          color: 'blue',
        },
      },
    });
    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    expect(viewEle.props.width).toBe(300);
  });

  //victoryLegend
  it('should render chart with title, subheading', () => {
    const tree = renderComponent({
      ...defaultProps,
      title: 'stackChart-Title',
      subheading: 'stackChart-SubHeading',
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle[0].props.title[0]).toBe('stackChart-Title');
    expect(viewEle[0].props.title[1]).toBe('stackChart-SubHeading');
  });

  it('getlegend should return null when showlegend is hide', () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'hide',
    });

    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle.length).toBe(1);
  });

  it('getlegend should return victorylegend when showlegend is bottom', () => {
    const tree = renderComponent({
      ...defaultProps,
      customcolors: ['red', 'blue'],
      showlegend: 'bottom',
      styles: {
        root: {
          height: 200,
        },
        text: {
          color: 'blue',
        },
      },
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle.length).toBe(2);
    expect(viewEle[1].props.colorScale[0]).toBe('red');
    expect(viewEle[1].props.colorScale[1]).toBe('blue');
  });

  it('getlegend should return victorylegend and the orientation prop was vertical, when showlegend is right or left', () => {
    const tree = renderComponent({
      ...defaultProps,
      customcolors: ['red', 'blue'],
      showlegend: 'right',
      styles: {
        root: {
          height: 200,
        },
        text: {
          color: 'blue',
        },
      },
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle.length).toBe(2);
    expect(viewEle[1].props.colorScale[0]).toBe('red');
    expect(viewEle[1].props.colorScale[1]).toBe('blue');
    expect(viewEle[1].props.orientation).toBe('vertical');
  });

  //victoryAxis
  it('should render VictoryAxis with tickvalues & tickformat', () => {
    const thickness = 20,
      padding = thickness / 2 + 5;
    //rendering
    const tree = renderComponent({
      thickness: thickness,
      ...defaultProps,
    });
    const viewEle = tree.UNSAFE_getByType(VictoryAxis);
    const length = viewEle.props.tickValues.length;
    expect(viewEle.props.tickValues[0]).toBeLessThanOrEqual(dataSet[0].x);
    expect(viewEle.props.tickValues[length - 1]).toBeGreaterThanOrEqual(
      dataSet[dataSet.length - 1].x
    );
    expect(viewEle.props.style.tickLabels.fill).toBe('#000000');
    expect(viewEle.props.style.tickLabels.padding).toBe(padding); //default padding
    expect(viewEle.props.style.axisLabel.padding).toBe(padding + thickness / 2);
  });

  it('if minvalue was 0 it should render victoryAxis with tickvalues', () => {
    const tree = renderComponent({
      ...defaultProps,
      dataset: [
        {
          x: -5,
          y: -10,
        },
        {
          x: 15,
          y: 20,
        },
        {
          x: 25,
          y: 30,
        },
      ],
    });
    const viewEle = tree.UNSAFE_getByType(VictoryAxis);
    expect(viewEle.props.tickValues[0]).toBe(-dataSet[0].y);
  });

  it('tickLabels should be transparent when showyaxis is false', () => {
    const tree = renderComponent({
      ...defaultProps,
      showyaxis: false,
    });
    const viewEle = tree.UNSAFE_getByType(VictoryAxis);
    expect(viewEle.props.style.tickLabels.fill).toBe('transparent');
  });

  //victorystack
  it('should render Victorystack with colorscale', () => {
    const thickness = 20;
    const tree = renderComponent({
      ...defaultProps,
      customcolors: ['red', 'blue', 'green'],
      thickness: thickness,
    });
    const viewEle = tree.UNSAFE_getByType(VictoryStack);
    expect(viewEle.props.colorScale[0]).toBe('red');
    expect(viewEle.props.colorScale[1]).toBe('blue');
    expect(viewEle.props.colorScale[2]).toBe('green');
  });

  it('shopuld render victorystack and getlegendview with 1 color ', () => {
    const tree = renderComponent({
      ...defaultProps,
      customcolors: ['red'],
    });
    const viewEle = tree.UNSAFE_getByType(VictoryStack);
    expect(viewEle.props.colorScale).toBe('red');
    const legendEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(legendEle[1].props.colorScale).toBe('red');
  });

  //getBarChart
  it('getBarChart function should return  victoryBar Component', () => {
    const viewEle = jest.spyOn(WmStackChart.prototype, 'getBarChart');
    const tree = renderComponent({
      ...defaultProps,
      dataset: dataSet[0],
      name: 'wm-stack-chart',
    });
    expect(viewEle).toHaveBeenCalled();
  });
  // expect(viewEle).toHaveReturnedWith([
  //   <VictoryBar
  //     key={`wm-stack-chart` + '_' + 0}
  //     cornerRadius={{ top: -5, bottom: -5 }}
  //     data={[
  //       {
  //         x: 0,
  //         y: 10,
  //       },
  //     ]}
  //     width={750}
  //   />,
  // ]);

  it('svg, victorylegend, getarcchart, getarcaxis should not render when viewtype === bar', async () => {
    const getArcChartMock = jest.spyOn(WmStackChart.prototype, 'getArcChart');
    const getArcAxisMock = jest.spyOn(WmStackChart.prototype, 'getArcChart');
    const tree = renderComponent({
      ...defaultProps,
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    const svg = tree.UNSAFE_getAllByType(Svg);
    expect(svg.length).toBe(2);
    expect(viewEle.length).toBe(2);
    expect(getArcChartMock).not.toHaveBeenCalled();
    expect(getArcAxisMock).not.toHaveBeenCalled();
  });

  //theme
  it('should render victory chart with theme', () => {
    const Victory = (viewEle) => {
      expect(viewEle[0].props.theme.group.colorScale[0]).toBe('#393b79');
      expect(viewEle[0].props.theme.group.width).toBe(250);
      expect(viewEle[0].props.theme.group.height).toBe(250);
      expect(viewEle[0].props.theme.legend.colorScale[0]).toBe('#393b79');
      expect(viewEle[0].props.theme.legend.orientation).toBe('vertical');
      expect(viewEle[0].props.theme.legend.gutter).toBe(10);
    };
    const tree = renderComponent({
      ...defaultProps,
      theme: 'Annabelle',
    });
    const viewEle1 = tree.UNSAFE_getAllByType(VictoryChart);
    Victory(viewEle1);

    const viewEle2 = tree.UNSAFE_getAllByType(VictoryLegend);
    Victory(viewEle2);

    const viewEle3 = tree.UNSAFE_getAllByType(VictoryAxis);
    Victory(viewEle3);
  });

  // const chartHeight = 300;
  const chartWidth = 500;
  const fireEventFunction = (chartWidth) => {
    return fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: chartWidth,
        },
      },
    });
  };

  //default prop viewtype wass changed'
  it('should render svg when default prop viewtype was changed', async () => {
    const tree = renderComponent({
      ...defaultProps,
      viewtype: 'Stack',
    });
    const viewEle = tree.UNSAFE_getAllByType(Svg);
    const root = screen.getByAccessibilityHint(defaultProps.hint);
    fireEvent(root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
        },
      },
    });
    await waitFor(() => {
      expect(viewEle[0].props.width).toBe(500);
      expect(viewEle[0].props.height).toBe(250);
    });
  });

  it('should render victoryLegend when default prop viewtype is not bar', async () => {
    const tree = renderComponent({
      ...defaultProps,
      viewtype: 'Stack',
      title: 'stackChart-Title',
      subheading: 'stackChart-SubHeading',
    });
    const SvgEle = tree.UNSAFE_getAllByType(Svg);
    fireEventFunction(chartWidth);
    const VictoryLegendEle = tree.UNSAFE_getAllByType(VictoryLegend);
    await waitFor(() => {
      expect(SvgEle[0].props.width).toBe(500);
      // expect(SvgEle[0].props.height).toBe(chartHeight - 50);
      expect(VictoryLegendEle[0].props.title[0]).toBe('stackChart-Title');
      expect(VictoryLegendEle[0].props.title[1]).toBe('stackChart-SubHeading');
    });
  });

  it('should call getArcChart when default prop viewtype was changed', async () => {
    const chartHeight = 0,
      thickness = 10;
    const tree = renderComponent({
      ...defaultProps,
      viewtype: 'Stack',
      customcolors: ['red', 'blue', 'green'],
      thickness: thickness,
    });
    fireEventFunction(chartWidth);
    const radius = Math.min(chartWidth / 2, chartHeight - 50);
    const viewEle = tree.UNSAFE_getAllByType(VictoryPie);
    expect(viewEle.length).toBe(4);
    expect(viewEle[0].props.radius).toBe(radius);
    expect(viewEle[1].props.radius).toBe(radius);
    expect(viewEle[2].props.radius).toBe(radius);
    expect(viewEle[0].props.colorScale[0]).toBe('green');
    expect(viewEle[0].props.innerRadius).toBe(radius - thickness);
  });

  it('should call getArcAxis when default prop viewtype was changed', async () => {
    const chartHeight = 0,
      thickness = 10;
    const tree = renderComponent({
      ...defaultProps,
      viewtype: 'Stack',
      thickness: thickness,
    });
    fireEventFunction(chartWidth);
    const radius = Math.min(chartWidth / 2, chartHeight - 50);
    const viewEle = tree.UNSAFE_getAllByType(VictoryPie);
    expect(viewEle[3].props.labelRadius).toBe(radius - thickness - 20);
  });
});
