import React, { ReactNode, createRef } from 'react';
import WmLineChart from '@wavemaker/app-rn-runtime/components/chart/line-chart/line-chart.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
import { constructSampleData } from '@wavemaker/app-rn-runtime/components/chart/staticdata';

const renderComponent = (props = {}) => {
  return render(<WmLineChart name="test_BubbleChart" {...props} />);
};
const dataSet = [
  {
    x: 10,
    y: 101,
  },
  {
    x: 20,
    y: 201,
  },
  {
    x: 30,
    y: 301,
  },
];
const defaultProps = {
  dataset: dataSet,
  xaxisdatakey: 'x',
  yaxisdatakey: 'y',
};

describe('Test LineChart component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  //should render when default props are given and also shouldnot render when default props are not given

  it('should render with null when default props was not given', () => {
    const tree = renderComponent();
    expect(tree.toJSON()).toBeNull();
  });

  it('should render when default props was given', () => {
    const tree = renderComponent({
      ...defaultProps,
    });
    expect(tree).toBeDefined();
  });

  //events - on before and on transform

  it('should call onBeforerender and onTransform events', () => {
    const onBeforeRenderMock = jest.fn();
    const onTransformMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmLineChart.prototype,
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

  //accessibility

  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      ...defaultProps,
      accessibilitylabel: 'LINECHART',
      accessibilityrole: 'LINECHART',
      hint: 'test LINECHART',
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
    expect(getByLabelText('LINECHART')).toBeTruthy();
    expect(getByRole('LINECHART')).toBeTruthy();
    expect(getByA11yHint('test LINECHART')).toBeTruthy();
    expect(getByRole('LINECHART').props.style.backgroundColor).toBe('red');
    expect(getByRole('LINECHART').props.style.width).toBe(200);
    expect(getByRole('LINECHART').props.style.height).toBe(300);
  });

  //show : false

  it('should have width and height to be 0 when show is false', () => {
    const { getByRole } = renderComponent({
      ...defaultProps,
      show: false,
      accessibilityrole: 'LINECHART',
    });
    const viewEle = getByRole('LINECHART');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  //title , subheading, icon

  it('should render title', () => {
    const { getByText } = renderComponent({
      title: 'Line Chart',
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
    expect(getByText('Line Chart')).toBeTruthy();
    expect(getByText('Line Chart').props.style.color).toBe('red');
    expect(getByText('Line Chart').props.style.fontSize).toBe(30);
    expect(getByText('Line Chart').props.style.lineHeight).toBe(10);
    expect(getByText('Line Chart').props.style.paddingLeft).toBe(20);
  });

  it('should render subheading', () => {
    const { getByText } = renderComponent({
      subheading: 'subHeading-Line Chart',
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
    const text = getByText('subHeading-Line Chart');
    expect(text).toBeTruthy();
    expect(text).toBeTruthy();
    expect(text.props.style.fontSize).toBe(20);
    expect(text.props.style.lineHeight).toBe(30);
    expect(text.props.style.color).toBe('red');
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

  it('should not render Icon when iconclass is not provided', () => {
    const tree = renderComponent({ ...defaultProps });
    const wmIcon = tree.UNSAFE_queryByType(WmIcon);
    expect(wmIcon).toBeNull();
  });

  //VictoryCharts starts here

  it('should render victorycharts with styles - offset and styles', () => {
    const tree = renderComponent({
      ...defaultProps,
      offsettop: 10,
      offsetbottom: 20,
      offsetright: 30,
      offsetleft: 40,
      styles: {
        root: {
          height: 100,
          width: 250,
        },
        text: {
          color: 'red',
        },
      },
    });
    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    expect(viewEle.props.padding.top).toBe(10);
    expect(viewEle.props.padding.bottom).toBe(20);
    expect(viewEle.props.padding.right).toBe(30);
    expect(viewEle.props.padding.left).toBe(40);
  });

  //victoryLine

  it('should render VictoryLine with - linethickValue, customcolors and interpolation , ', () => {
    const colorScale = ['red', 'yellow', 'green'];
    const linethickValue = 5;
    const tree = renderComponent({
      ...defaultProps,
      linethickness: linethickValue,
      customcolors: colorScale,
    });

    const viewEle = tree.UNSAFE_getByType(VictoryLine);
    expect(viewEle.props.interpolation).toBe('linear');
    expect(viewEle.props.style.data.strokeWidth).toBe(linethickValue);
    expect(viewEle.props.style.data.stroke).toBe(colorScale[0]);
    expect(viewEle.props.data[0].y).toBe(101);

    tree.rerender(
      <WmLineChart
        {...defaultProps}
        name="test_AreaChart"
        interpolation="cardinal"
      />
    );
    const victoryAreaEle1 = tree.UNSAFE_getByType(VictoryLine);
    expect(victoryAreaEle1.props.interpolation).toBe('cardinal');

    tree.rerender(
      <WmLineChart
        {...defaultProps}
        name="test_AreaChart"
        interpolation="step"
      />
    );
    const victoryAreaEle2 = tree.UNSAFE_getByType(VictoryLine);
    expect(victoryAreaEle2.props.interpolation).toBe('step');
  });

  //victoryScatter

  it('should render VictoryScatter with colorScale', () => {
    const colorScale = ['red', 'yellow', 'green'];
    const tree = renderComponent({
      ...defaultProps,
      customcolors: colorScale,
    });

    const viewEle = tree.UNSAFE_getByType(VictoryScatter);
    expect(viewEle.props.style.data.fill).toBe(colorScale[0]);
    expect(viewEle.props.style.data.opacity).toBe(0.8);
  });

  //call onselect event
  it('should call onSelect event', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmLineChart.prototype,
      'invokeEventCallback'
    );
    const customRef = createRef<WmLineChart>();

    const tree = renderComponent({
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
        x: 10,
        y: 20,
        z: 30,
      },
      index: 0,
    };
    act(() => {
      customRef.current.onSelect(event, dataSet1);
    });

    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onSelect',
      expect.anything()
    );
  });

  //get tool tip
  it('should render get tooltip ', async () => {
    const getTooltipMock = jest.spyOn(WmLineChart.prototype, 'getTooltip');
    const customRef = createRef<WmLineChart>();
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
      expect(getByText('10')).toBeTruthy();
      expect(getByText('20')).toBeTruthy();
    });
  });

  //Advanced settings xaxis, yaxis
  it('checking Advanced Settings', () => {
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
    const viewEle = tree.UNSAFE_getAllByType(VictoryAxis);
    expect(viewEle[0].props.label).toBe('x(cm)');
    expect(viewEle[1].props.label).toBe('y(cm)');
  });

  //ShowLegend === 'hide'
  it('showlegend set to hidden', () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'hide',
      colorScale: ['red', 'yellow', 'green'],
    });
    expect(tree.UNSAFE_queryByType(VictoryLegend)).toBeFalsy();
  });

  //ShowLegend except hide
  it('showlegend except hidden like showlegend as top,bottom,left,right', () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'top',
      colorScale: ['red', 'yellow', 'green'],
    });
    expect(tree.UNSAFE_getByType(VictoryLegend)).toBeDefined();
  });

  //theme
  it('should render theme', () => {
    const tree = renderComponent({
      ...defaultProps,
      theme: 'Annabelle',
    });
    const viewEle1 = tree.UNSAFE_getByType(VictoryChart);
    expect(viewEle1.props.theme.group.colorScale[0]).toBe('#393b79');
    expect(viewEle1.props.theme.group.width).toBe(250);
    expect(viewEle1.props.theme.group.height).toBe(250);
    expect(viewEle1.props.theme.legend.colorScale[0]).toBe('#393b79');
    expect(viewEle1.props.theme.legend.orientation).toBe('vertical');
    expect(viewEle1.props.theme.legend.gutter).toBe(10);

    const viewEle2 = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle2[0].props.theme.group.colorScale[0]).toBe('#393b79');
    expect(viewEle2[0].props.theme.group.width).toBe(250);
    expect(viewEle2[0].props.theme.group.height).toBe(250);
    expect(viewEle2[0].props.theme.legend.colorScale[0]).toBe('#393b79');
    expect(viewEle2[0].props.theme.legend.orientation).toBe('vertical');
    expect(viewEle2[0].props.theme.legend.gutter).toBe(10);
  });

  //show xaxis
  it('showxaxis', () => {
    const tree = renderComponent({
      ...defaultProps,
      showxaxis: false,
    });
    expect(tree.UNSAFE_getAllByType(VictoryAxis).length).toBe(1);
  });

  //show yaxis
  it('showyaxis', () => {
    const tree = renderComponent({
      ...defaultProps,
      showyaxis: false,
    });
    expect(tree.UNSAFE_getAllByType(VictoryAxis).length).toBe(1);
  });

  it('checking the ynumberformat is rounding y axis values to nearest whole number or not', () => {
    const setYAxisFormatMock = jest.spyOn(
      WmLineChart.prototype,
      'setYAxisFormat'
    );
    const tree = renderComponent({
      // ...defaultProps,
      dataset: [
        { x: 10, y: '101' },
        { x: 20, y: '201' },
        { x: 30, y: '301' },
      ],
      xaxisdatakey: 'x',
      yaxisdatakey: 'y',
      ynumberformat: '%',
    });
    expect(setYAxisFormatMock).toHaveBeenCalled();
    // tickformat in victoryaxis defaultly taking y axis values and providing static values
    expect(setYAxisFormatMock).toHaveReturnedWith(
      '0%',
      '15000%',
      '20000%',
      '30000%'
    );

    tree.rerender(
      <WmLineChart
        name="test_LineChart"
        {...defaultProps}
        ynumberformat="Billion"
      />
    );
    expect(setYAxisFormatMock).toHaveReturnedWith(
      '0.0B',
      '0.0B',
      '0.0B',
      '0.0B'
    );

    tree.rerender(
      <WmLineChart
        name="test_LineChart"
        {...defaultProps}
        ynumberformat="Million"
      />
    );
    expect(setYAxisFormatMock).toHaveReturnedWith(
      '0.0M',
      '0.0M',
      '0.0M',
      '0.0M'
    );

    tree.rerender(
      <WmLineChart
        name="test_LineChart"
        {...defaultProps}
        ynumberformat="Thousand"
      />
    );
    expect(setYAxisFormatMock).toHaveReturnedWith(
      '0.1K',
      '0.2K',
      '0.3K',
      '0.4K'
    );

    tree.rerender(
      <WmLineChart name="test_LineChart" {...defaultProps} ynumberformat=",r" />
    );
    expect(setYAxisFormatMock).toHaveReturnedWith('150', '200', '250', '300');
  });

  it('should render chart component with default data when dataset is empty', () => {
    const tree = renderComponent({
      xaxisdatakey: 'x',
      yaxisdatakey: 'y',
      dataset: [],
      type: 'Line',
    });

    expect(constructSampleData).toBeDefined();
    const viewEle2 = tree.UNSAFE_getByType(VictoryLine);
    expect(viewEle2.props.data[0].y).toBe(2);
    expect(viewEle2.props.data[1].y).toBe(0);
    expect(viewEle2.props.data[2].y).toBe(3);
    expect(viewEle2.props.data[0].x).toBe(0);
    expect(viewEle2.props.data[1].x).toBe(1);
    expect(viewEle2.props.data[2].x).toBe(2);
  });

  //isrtl
  it('checking data', () => {
    const isRTLmock = jest
      .spyOn(WmLineChart.prototype, 'isRTL', 'get')
      .mockImplementation(() => {
        return true;
      });

    const tree = renderComponent({
      ...defaultProps,
    });
    const vaxis = tree.UNSAFE_getAllByType(VictoryAxis);

    const viewEle2 = tree.UNSAFE_getByType(VictoryLine);
    expect(viewEle2.props.data[0].y).toBe(101);
    expect(viewEle2.props.data[1].y).toBe(201);
    expect(viewEle2.props.data[2].y).toBe(301);
    expect(viewEle2.props.data[0].x).toBe(0);
    expect(viewEle2.props.data[1].x).toBe(1);
    expect(viewEle2.props.data[2].x).toBe(2);
    const viewEle3 = tree.UNSAFE_getByType(VictoryScatter);
    expect(viewEle3.props.data[0].y).toBe(301);
    expect(viewEle3.props.data[1].y).toBe(201);
    expect(viewEle3.props.data[2].y).toBe(101);
    expect(viewEle3.props.data[0].x).toBe(2);
    expect(viewEle3.props.data[1].x).toBe(1);
    expect(viewEle3.props.data[2].x).toBe(0);

    isRTLmock.mockReset();
    jest.clearAllMocks();
  });
});
