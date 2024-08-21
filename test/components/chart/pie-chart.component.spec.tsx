import React, { ReactNode, createRef } from 'react';
import WmPieChart from '@wavemaker/app-rn-runtime/components/chart/pie-chart/pie-chart.component';
import { Svg } from 'react-native-svg';
import { Legend } from '@wavemaker/app-rn-runtime/components/chart/legend/legend.component';
import {
  fireEvent,
  render,
  waitFor,
  screen,
  act,
  cleanup,
} from '@testing-library/react-native';
import WmIcon from '@wavemaker/app-rn-runtime/components/basic/icon/icon.component';
import { VictoryPie, VictoryLabel } from 'victory-native';

const onViewLayout = (element, Width, Height) => {
  return fireEvent(element, 'layout', {
    nativeEvent: {
      layout: {
        width: Width,
        height: Height,
      },
    },
  });
};

const onInfoViewLayoutChange = (element, Height) => {
  return fireEvent(element, 'layout', {
    nativeEvent: {
      layout: {
        height: Height,
      },
    },
  });
};

const renderComponent = (props = {}) => {
  return render(<WmPieChart {...props} name="test_PieChart" />);
};
const dataSet = [
  { x: 'Cats', y: 35 },
  { x: 'Dogs', y: 40 },
  { x: 'Birds', y: 55 },
];
const defaultProps = { dataset: dataSet, xaxisdatakey: 'x', yaxisdatakey: 'y' };

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('Test PieChart component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  //should render when default props are given and also shouldnot render when default props are not given
  it('Should render component', () => {
    const tree = renderComponent(defaultProps);
    expect(tree.toJSON()).not.toBeNull();
    expect(tree).toMatchSnapshot();
  });

  it('should render with null when props are not given', () => {
    const tree = renderComponent();
    expect(tree.toJSON()).toBeNull();
  });

  //title, titlesIcon subheading
  it('should render title', () => {
    const { getByText } = renderComponent({
      title: 'Pie-Chart',
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
    expect(getByText('Pie-Chart')).toBeTruthy();
    expect(getByText('Pie-Chart').props.style.color).toBe('red');
    expect(getByText('Pie-Chart').props.style.fontSize).toBe(30);
    expect(getByText('Pie-Chart').props.style.lineHeight).toBe(10);
    expect(getByText('Pie-Chart').props.style.paddingLeft).toBe(20);
  });

  it('should render subheading', () => {
    const { getByText } = renderComponent({
      subheading: 'subHeading-Pie Chart',
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
    const text = getByText('subHeading-Pie Chart');
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

  // events - onBeforerender and onTransform
  it('should call onBeforerender and onTransform events', () => {
    const onBeforeRenderMock = jest.fn();
    const onTransformMock = jest.fn();
    const invokeEventCallbackMock = jest.spyOn(
      WmPieChart.prototype,
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

  //onSelect
  it('should call onSelect event', async () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmPieChart.prototype,
      'invokeEventCallback'
    );
    const customRef = createRef<WmPieChart>();
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
      slice: {
        value: 1,
      },
      style: {
        fill: {
          color: 'red',
        },
      },
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

  //Accessibility
  it('should apply accessibility props correctly', async () => {
    const { getByRole, getByLabelText, getByA11yHint } = renderComponent({
      ...defaultProps,
      accessibilitylabel: 'Pie',
      accessibilityrole: 'Pie',
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
    expect(getByLabelText('Pie')).toBeTruthy();
    expect(getByRole('Pie')).toBeTruthy();
    expect(getByA11yHint('test button')).toBeTruthy();
    expect(getByRole('Pie').props.style[1].backgroundColor).toBe('red');
    expect(getByRole('Pie').props.style[1].width).toBe(200);
    expect(getByRole('Pie').props.style[1].height).toBe(300);
  });

  //setting the width
  it('if width was set then (svg, VictoryPie, victoryLegend) ', async () => {
    const showlegend: string = 'left',
      rootHeight = 0;
    const tree = renderComponent({
      ...defaultProps,
    });

    //updating the width
    const viewWidth = 500;
    const totalHeight = 300;
    const root = screen.root;
    onViewLayout(root, viewWidth, totalHeight);
    const subChild = screen.root.children[0];
    const infoHeight = 300;
    const legendHeight = 0;
    onInfoViewLayoutChange(subChild, infoHeight);
    const chartHeight =
      (rootHeight ? totalHeight : viewWidth) -
      infoHeight -
      (showlegend === 'right' ? 0 : legendHeight);

    //expectations
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(Svg);
      expect(viewEle).toBeDefined();
      expect(viewEle.props.width).toBe(viewWidth);
      expect(viewEle.props.height).toBe(chartHeight);
      expect(tree.UNSAFE_queryByType(Legend)).toBeDefined();
      expect(tree.UNSAFE_getByType(VictoryPie)).toBeDefined();
    });
  });

  it('if width was not set then svg should not render', async () => {
    const tree = renderComponent({
      ...defaultProps,
    });
    await waitFor(() => {
      expect(tree.UNSAFE_queryByType(Svg)).toBeNull();
    });
  });

  //victory charts starts here

  //victory pie and victoryLabel
  it('Victory Pie and victoryLabel should render with user defined props', async () => {
    const rootHeight = 0,
      infoHeight = 10,
      showlegend: string = 'top',
      legendWidth = 0,
      legendHeight = 0;

    //spying on the function
    const getLabelMock = jest.spyOn(WmPieChart.prototype, 'getLabel');

    //rendering pieChart
    const tree = renderComponent({
      ...defaultProps,
      showlegend: showlegend,
      customcolors: ['tomato', 'orange', 'gold'],
      showlabels: 'hide',
      styles: {
        centerLabel: {
          color: 'brown',
          fontSize: 30,
        },
        text: {
          color: 'yellow',
        },
      },
      centerlabel: 'centerlabel',
    });

    //updating the width and height
    const viewWidth = 500;
    const totalHeight = 510;
    onViewLayout(screen.root, viewWidth, totalHeight);
    const chartWidth = viewWidth - (showlegend === 'right' ? legendWidth : 0);
    const chartHeight =
      (rootHeight ? totalHeight : chartWidth) -
      infoHeight -
      (showlegend === 'right' ? 0 : legendHeight);
    const origin = { x: viewWidth / 2, y: chartHeight / 2 };
    const radius = (Math.min(viewWidth, chartHeight) - 40) / 2;

    //expects
    let viewEle, viewLabel;
    await waitFor(() => {
      viewEle = tree.UNSAFE_getByType(VictoryPie);
      viewLabel = tree.UNSAFE_getAllByType(VictoryLabel);
      expect(viewEle.props.radius).toBe(radius);
      expect(viewEle.props.colorScale[0]).toBe('tomato');
      expect(viewEle.props.colorScale[1]).toBe('orange');
      expect(viewEle.props.colorScale[2]).toBe('gold');
      expect(viewEle.props.endAngle).toBe(0);
      expect(viewEle.props.innerRadius).toBe(0);
      expect(viewEle.props.origin.x).toBe(origin.x);
      expect(viewEle.props.origin.y).toBe(origin.y);
      expect(getLabelMock).toHaveBeenCalled();
      expect(viewEle.props.style.labels.display).toBe('none');

      //victoryLabel
      expect(viewLabel[3].props.x).toBe(origin.x);
      expect(viewLabel[3].props.y).toBe(origin.y);
      expect(viewLabel[3].props.style.color).toBe('brown');
      expect(viewLabel[3].props.style.fontSize).toBe(30);
      expect(viewLabel[3].props.style.fill).toBe('brown');
      expect(viewLabel[3].props.text).toBe('centerlabel');
    });

    tree.rerender(
      <WmPieChart {...defaultProps} name="test_PieChart" showlabels="inside" />
    );
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryPie);
      expect(viewEle.props.labelRadius).toBe(radius / 2);
    });
    tree.rerender(
      <WmPieChart {...defaultProps} name="test_PieChart" showlabels="outside" />
    );
    await waitFor(() => {
      const viewEle = tree.UNSAFE_getByType(VictoryPie);
      expect(viewEle.props.labelRadius).toBe(radius + 8);
    });
  });

  // show set to false
  it('should have width and height to be 0 when show is false', () => {
    const { getByRole } = renderComponent({
      ...defaultProps,
      show: false,
      accessibilityrole: 'PIECHART',
    });
    const viewEle = getByRole('PIECHART');
    expect(viewEle.props.style[1].width).toBe(0);
    expect(viewEle.props.style[1].height).toBe(0);
  });

  //show legend set to right
  it('show legend set to right', async () => {
    const showlegend = 'right',
      rootHeight = 0;

    //rendering the piechart
    const tree = renderComponent({
      ...defaultProps,
      showlegend: showlegend,
    });

    const viewWidth = 500;
    const totalHeight = 510;
    const root = screen.root;
    onViewLayout(root, viewWidth, totalHeight);
    const subChild = screen.root.children[0];
    const infoHeight = 300;
    const legendWidth = 300,
      legendHeight = 100;
    onInfoViewLayoutChange(subChild, infoHeight);
    const child = screen.root.children;
    const childOfSubChild = child[1].children[0].children[1];
    onViewLayout(childOfSubChild, legendWidth, legendHeight);

    //initialising chartwidth and height with given values
    const chartWidth = viewWidth - (showlegend === 'right' ? legendWidth : 0);
    const chartHeight =
      (rootHeight ? totalHeight : chartWidth) -
      infoHeight -
      (showlegend === 'right' ? 0 : legendHeight);

    await waitFor(() => {
      const viewEle = tree.UNSAFE_queryByType(Svg);
      expect(viewEle.props.width).toBe(chartWidth);
      expect(viewEle.props.height).toBe(chartHeight);
    });
  });

  it('if same width is updated at parent and child layout than svg shouldnot  render', async () => {
    //rendering the piechart
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'right',
    });

    //update width and height
    const viewWidth = 500;
    const totalHeight = 510;
    const root = screen.root;
    onViewLayout(root, viewWidth, totalHeight);
    const child = screen.root.children;
    const subChild = child[1].children[0].children[1];
    const legendwidth = 500,
      legendheight = 22;
    onViewLayout(subChild, legendwidth, legendheight);

    await timer(300);
    await waitFor(() => {
      expect(tree.UNSAFE_queryByType(Svg)).toBeNull();
    });
  });

  //show legend set to bottom
  it('if showlegend is bottom and width was set than svg should  render', async () => {
    //rendering piechart
    const tree = renderComponent({
      ...defaultProps,
      showlegend: 'bottom',
    });

    const viewWidth = 500;
    const totalHeight = 0;
    const root = screen.root;
    onViewLayout(root, viewWidth, totalHeight);

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Svg)).toBeDefined();
    });

    const legendWidth = 500,
      legendHeight = 22;
    const child = screen.root.children[2];
    onViewLayout(child, legendWidth, legendHeight);

    await waitFor(() => {
      expect(tree.UNSAFE_getByType(Svg)).toBeDefined();
    });
  });

  //tooltip
  it('should render get tooltip ', async () => {
    const getTooltipMock = jest.spyOn(WmPieChart.prototype, 'getTooltip');
    const customRef = createRef<WmPieChart>();
    const { getByText, getAllByText } = renderComponent({
      ...defaultProps,
      caption: 'newcaption',
      ref: customRef,
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
        x: 0,
        y: 1,
        z: 2,
      },
      index: 0,
      slice: {
        value: 1,
      },
      style: {
        fill: {
          color: 'red',
        },
      },
    };
    act(() => {
      customRef.current.onSelect(event, dataSet1);
    });
    await waitFor(() => {
      expect(customRef.current.state.isTooltipOpen).toBe(true);
      expect(getTooltipMock).not.toBeNull();
      expect(getAllByText('Cats')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });
  });

  //get label
  it('when label type is percent then getlabel should return value with percentage to the labels in the victorypieComponent', async () => {
    const WmPieChartMock = jest.spyOn(WmPieChart.prototype, 'getLabel');
    const tree = renderComponent({
      ...defaultProps,
      labeltype: 'percent',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
          height: 22,
        },
      },
    });
    await waitFor(() => {
      expect(WmPieChartMock).toHaveBeenCalled();
      expect(WmPieChartMock).toHaveReturnedWith('42%');
    });
  });

  it('when label type is key then getlabel should return key to the labels in the victorypieComponent', async () => {
    const WmPieChartMock = jest.spyOn(WmPieChart.prototype, 'getLabel');
    const tree = renderComponent({
      ...defaultProps,
      labeltype: 'key',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
          height: 122,
        },
      },
    });
    await waitFor(() => {
      expect(WmPieChartMock).toHaveBeenCalled();
      expect(WmPieChartMock).toHaveReturnedWith('Cats', 'Dogs', 'Birds');
    });
  });

  it('when label type is value then getlabel should return value to the labels in the victorypieComponent', async () => {
    const WmPieChartMock = jest.spyOn(WmPieChart.prototype, 'getLabel');
    const tree = renderComponent({
      ...defaultProps,
      labeltype: 'value',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
          height: 122,
        },
      },
    });
    await waitFor(() => {
      expect(WmPieChartMock).toHaveBeenCalled();
      expect(WmPieChartMock).toHaveReturnedWith('35', '40', '55');
    });
  });

  it('when label type is key-value then getlabel should return key-value to the labels in the victorypieComponent', async () => {
    const WmPieChartMock = jest.spyOn(WmPieChart.prototype, 'getLabel');
    const tree = renderComponent({
      ...defaultProps,
      labeltype: 'key-value',
    });
    fireEvent(screen.root, 'layout', {
      nativeEvent: {
        layout: {
          width: 500,
          height: 122,
        },
      },
    });
    await waitFor(() => {
      expect(WmPieChartMock).toHaveBeenCalled();
      expect(WmPieChartMock).toHaveReturnedWith(
        'Cats 35',
        'Dogs 40',
        'Birds 55'
      );
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
    await waitFor(() => {
      const viewEle1 = tree.UNSAFE_getByType(VictoryPie);
      expect(viewEle1.props.theme.group.colorScale[0]).toBe('#393b79');
      expect(viewEle1.props.theme.group.width).toBe(250);
      expect(viewEle1.props.theme.group.height).toBe(250);
      expect(viewEle1.props.theme.legend.colorScale[0]).toBe('#393b79');
      expect(viewEle1.props.theme.legend.orientation).toBe('vertical');
      expect(viewEle1.props.theme.legend.gutter).toBe(10);
    });
  });
});
