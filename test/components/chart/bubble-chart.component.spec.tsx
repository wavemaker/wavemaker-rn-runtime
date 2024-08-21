import React, { ReactNode, createRef } from 'react';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
// import { Text, TouchableOpacity } from 'react-native';
import WmBubbleChart from '@wavemaker/app-rn-runtime/components/chart/bubble-chart/bubble-chart.component';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

const renderComponent = (props = {}) => {
  return render(
    <WmBubbleChart
      state={{ chartWidth: 300 }}
      name="test_BubbleChart"
      {...props}
      // style={[`${styles.root}, ${styles.text}`]}
    />
  );
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

describe('Test BubbleChart component', () => {
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

  //title subheading titleIcon
  it('should render bubblechart with title', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      title: 'bubblechart-title',
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
    expect(getByText('bubblechart-title')).toBeTruthy();
    expect(getByText('bubblechart-title').props.style.color).toBe('red');
    expect(getByText('bubblechart-title').props.style.fontSize).toBe(30);
    expect(getByText('bubblechart-title').props.style.lineHeight).toBe(10);
    expect(getByText('bubblechart-title').props.style.paddingLeft).toBe(20);
  });

  it('should render bublechart with subheading', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      subheading: 'bubblechart-subheading',
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
    const text = getByText('bubblechart-subheading');
    expect(text).toBeTruthy();
    expect(text.props.style.fontSize).toBe(20);
    expect(text.props.style.lineHeight).toBe(30);
    expect(text.props.style.color).toBe('red');
  });

  it('should render Icon when iconclass is provided', () => {
    const { getByText } = renderComponent({
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
    expect(getByText('edit')).toBeTruthy();
    expect(getByText('edit').props.style[1].fontSize).toBe(40);
  });

  it('should not render  Icon when iconclass is not provided', () => {
    const tree = renderComponent({ ...defaultProps });
    const wmIcon = tree.UNSAFE_queryByType(WmIcon);
    expect(wmIcon).toBeNull();
  });

  // events - onBeforerender and onTransform
  it('should call onBeforerender and onTransform events', () => {
    const onBeforeRenderMock = jest.fn();
    const onTransformMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmBubbleChart.prototype,
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

  //onSelect event
  it('should call onSelect event', async () => {
    // change the assertions to check the functionality of onSelect method
    const invokeEventCallbackMock = jest.spyOn(
      WmBubbleChart.prototype,
      'invokeEventCallback'
    );

    const customRef = createRef<WmBubbleChart>();
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
    // onselect callback???
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
    await waitFor(() => {
      expect(customRef.current.state.isTooltipOpen).toBeTruthy();
    });
    expect(invokeEventCallbackMock).toHaveBeenCalled();
  });

  //accessibility
  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      ...defaultProps,
      accessibilitylabel: 'BUBBLECHART',
      accessibilityrole: 'BUBBLECHART',
      hint: 'test BUBBLECHART',
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
    expect(getByLabelText('BUBBLECHART')).toBeTruthy();
    expect(getByRole('BUBBLECHART')).toBeTruthy();
    expect(getByA11yHint('test BUBBLECHART')).toBeTruthy();
    expect(getByRole('BUBBLECHART').props.style.backgroundColor).toBe('red');
    expect(getByRole('BUBBLECHART').props.style.width).toBe(200);
    expect(getByRole('BUBBLECHART').props.style.height).toBe(300);
  });

  //show - false
  it('should have width and height to be 0 when show is false', () => {
    const { getByRole } = renderComponent({
      ...defaultProps,
      show: false,
      accessibilityrole: 'BUBBLECHART',
    });
    const viewEle = getByRole('BUBBLECHART');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  //victorycharts
  it('should render victorycharts with styles', () => {
    const tree = renderComponent({
      ...defaultProps,
      offsettop: 10,
      offsetbottom: 10,
      offsetright: 10,
      offsetleft: 10,
      styles: {
        root: {
          height: 600,
        },
        text: {
          color: 'red',
        },
      },
    });
    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    expect(viewEle.props.padding.top).toBe(10);
    expect(viewEle.props.padding.bottom).toBe(10);
    expect(viewEle.props.padding.right).toBe(10);
    expect(viewEle.props.padding.left).toBe(10);
    expect(viewEle.props.height).toBe(600);
  });

  //victorylegend
  it('should render VictoryLegend with styles', () => {
    const tree = renderComponent({
      ...defaultProps,
      containerComponent: 'Svg',
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryLegend);
    expect(viewEle[0].props.containerComponent.type.displayName).toBe('Svg');
  });

  //shape
  it('renders shape in updateData', () => {
    const updateDataMock = jest.spyOn(WmBubbleChart.prototype, 'updateData');
    const shapes = 'circle';
    renderComponent({
      ...defaultProps,
      shape: shapes,
    });
    expect(updateDataMock).toHaveBeenCalled();
    expect(updateDataMock.mock.calls[0][0][0][0].symbol).toBe(shapes);
  });

  //AdvancedSettings
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

    expect(screen).toMatchSnapshot();
    const viewEle = tree.UNSAFE_getAllByType(VictoryAxis);
    expect(viewEle[0].props.label).toBe('x(cm)');
    expect(viewEle[1].props.label).toBe('y(cm)');
  });

  //victoryScatter
  it('should render VictoryScatter with colorscale', () => {
    const colorScale = ['red', 'yellow', 'green'];
    const tree = renderComponent({
      ...defaultProps,
      customcolors: colorScale,
    });
    const viewEle = tree.UNSAFE_getAllByType(VictoryScatter);
    expect(viewEle[0].props.colorScale).toBe(colorScale);
    // expect(viewEle[0].props.name).toBe('test_BubbleChart_bubble_0');
  });

  //gettooltip
  it('should render get tooltip ', async () => {
    const getTooltipMock = jest.spyOn(WmBubbleChart.prototype, 'getTooltip');
    const customRef = createRef<WmBubbleChart>();
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

    expect(screen).toMatchSnapshot();

    const textElemets = screen.getAllByText('10');
  });

  //showlegend
  it('showlegend set to hidden', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'hide',
      colorScale: ['red', 'yellow', 'green'],
    });

    expect(tree.UNSAFE_getAllByType(VictoryLegend).length).toBe(1);
  });

  it('showlegend except hidden like showlegend as top,bottom,left,right', async () => {
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'top',
      colorScale: ['red', 'yellow', 'green'],
    });

    expect(tree.UNSAFE_getAllByType(VictoryLegend).length).toBe(2);
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

  it('showxaxis', async () => {
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
