import React, { ReactNode, createRef } from 'react';
import WmColumnChart from '@wavemaker/app-rn-runtime/components/chart/column-chart/column-chart.component';
import WmColumnChartProps from '@wavemaker/app-rn-runtime/components/chart/column-chart/column-chart.props';
import ThemeFactory from '@wavemaker/app-rn-runtime/components/chart/theme/chart.theme';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLegend,
  VictoryGroup,
  VictoryStack,
  VictoryBar,
} from 'victory-native';
import { render, waitFor, screen, act } from '@testing-library/react-native';

const renderComponent = (props = {}) => {
  return render(
    <WmColumnChart
      state={{ chartWidth: 300 }}
      name="test_BubbleChart"
      {...props}
      // style={[`${styles.root}, ${styles.text}`]}
    />
  );
};

describe('Test BarChart component', () => {
  const baseProps: WmColumnChartProps = {
    id: 'bar-chart-1',
    name: 'test_BarChar',
    title: 'Sample Bar Chart',
    subheading: 'This is a test bar chart',
    dataset: [
      { category: 'Category 1', value: 10 },
      { category: 'Category 2', value: 20 },
      { category: 'Category 3', value: 30 },
    ],
    xaxisdatakey: 'category',
    yaxisdatakey: 'value',
    showvalues: true,
    horizontal: true,
    viewtype: 'Grouped',
    loadingdatamsg: 'Loading...',
    nodatamessage: 'No data found',
    customcolors: ['blue', 'green', 'red'],
  };

  //default props , title
  it('should render WmBarChart component correctly', () => {
    const tree = render(
      <WmColumnChart
        name="test_BarChart"
        dataset={baseProps.dataset}
        xaxisdatakey={baseProps.xaxisdatakey}
        yaxisdatakey={baseProps.yaxisdatakey}
        title={baseProps.title}
        subheading={baseProps.subheading}
      />
    ).toJSON();
    expect(screen).toMatchSnapshot();

    expect(tree).not.toBeNull();
  });

  it('should render with null when default props was not given', () => {
    const tree = render(<WmColumnChart />);

    expect(Array.isArray(tree.toJSON())).toBe(false);
    expect(tree.toJSON().children).toBeNull();
  });

  it('should render bar chart with given dataset', () => {
    const tree = render(<WmColumnChart {...baseProps} />);

    expect(screen.getByText(baseProps.title)).toBeTruthy();
    expect(screen.getByText(baseProps.subheading)).toBeTruthy();
  });

  it('should render title with icon', () => {
    const tree = render(
      <WmColumnChart {...baseProps} iconclass="fa fa-edit" />
    );

    expect(screen.getByText(baseProps.title)).toBeTruthy();
    expect(screen.getByText('edit')).toBeTruthy();
  });

  //3 events covered
  it('should handle beforeRender event callback', () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmColumnChart.prototype,
      'invokeEventCallback'
    );
    const tree = render(<WmColumnChart {...baseProps} />);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onBeforerender',
      expect.anything()
    );
    expect(invokeEventCallbackMock).toHaveBeenCalled();
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onBeforerender',
      expect.anything()
    );
  });

  it('should handle on Transform event callback', () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmColumnChart.prototype,
      'invokeEventCallback'
    );
    const tree = render(<WmColumnChart {...baseProps} />);
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onTransform',
      expect.anything()
    );
    expect(invokeEventCallbackMock).toHaveBeenCalled();
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onTransform',
      expect.anything()
    );
  });

  it('should handle onSelect event callback when a bar is selected', () => {
    const invokeEventCallback = jest.spyOn(
      WmColumnChart.prototype,
      'invokeEventCallback'
    );
    const barRef: any = createRef();
    render(<WmColumnChart {...baseProps} ref={barRef} />);

    const mockEvent = { nativeEvent: {} };
    const mockData = {
      data: baseProps.dataset.map((item: any, index: number) => ({
        y: item.value,
        x: index,
      })),
      index: 0,
      datum: { x: 0 },
    };

    if (barRef.current) {
      jest.spyOn(barRef.current, 'onSelect');
      barRef.current.onSelect(mockEvent, mockData);
    }

    expect(barRef.current.onSelect).toHaveBeenCalled();
    expect(barRef.current.onSelect).toHaveBeenCalledWith(mockEvent, mockData);
    expect(invokeEventCallback).toHaveBeenCalled();
    expect(invokeEventCallback).toHaveBeenCalledWith(
      'onSelect',
      expect.anything()
    );
  });

  it('should apply accessibility props correctly', async () => {
    const tree = render(
      <WmColumnChart
        {...baseProps}
        accessibilitylabel="Bar Chart Accessibility Label"
        accessibilityrole="Bar Chart Accessibility Role"
        hint="Bar Chart Accessibility Hint"
      />
    );
    expect(screen.getByLabelText('Bar Chart Accessibility Label')).toBeTruthy();
    expect(screen.getByRole('Bar Chart Accessibility Role')).toBeTruthy();
    expect(screen.getByA11yHint('Bar Chart Accessibility Hint')).toBeTruthy();
  });

  it('should have width and height to be 0 when show is false', () => {
    render(
      <WmColumnChart {...baseProps} show="false" accessibilityrole="BarChart" />
    );
    const viewEle = screen.getByRole('BarChart');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  it('should render tooltip on select', async () => {
    const getTooltipMock = jest.spyOn(WmColumnChart.prototype, 'getTooltip');
    const customRef = createRef<WmColumnChart>();
    const { getByText } = render(
      <WmColumnChart {...baseProps} ref={customRef} />
    );

    const event = {
      nativeEvent: {
        offsetX: 'Category 1',
        locationX: 14,
        offsetY: 10,
        locationY: 25,
      },
    };

    const dataSet1 = {
      data: baseProps.dataset.map((item: any, index: number) => ({
        y: item.value,
        x: index,
      })),
      datum: { x: 0, y: 1, z: 2 },
      index: 0,
    };
    act(() => {
      customRef.current.onSelect(event, dataSet1);
    });
    await waitFor(() => {
      expect(customRef.current.state.isTooltipOpen).toBe(true);
      expect(getTooltipMock).not.toBeNull();
      expect(getByText('Category 1')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });
  });

  //advanced settings
  it('should render legend when showlegend is "bottom"', () => {
    const tree = render(<WmColumnChart {...baseProps} showlegend="bottom" />);
    const viewEle = tree.UNSAFE_getByType(VictoryLegend);
    expect(viewEle).toBeTruthy();
  });

  it('should render legend when showlegend is "top"', () => {
    const tree = render(<WmColumnChart {...baseProps} showlegend="top" />);
    const viewEle = tree.UNSAFE_getByType(VictoryLegend);
    expect(viewEle).toBeTruthy();
  });

  it('should render VictoryStack when viewtype was stack', () => {
    const tree = render(<WmColumnChart {...baseProps} viewtype="Stacked" />);
    const stackEle = tree.UNSAFE_getByType(VictoryStack);
    const groupEle = tree.UNSAFE_queryByType(VictoryGroup);
    expect(stackEle).toBeTruthy();
    expect(groupEle).toBeNull();
  });

  it('should render the chart with grouped viewtype', () => {
    const tree = render(<WmColumnChart {...baseProps} viewtype="Grouped" />);
    const groupEle = tree.UNSAFE_getByType(VictoryGroup);
    const stackEle = tree.UNSAFE_queryByType(VictoryStack);
    expect(groupEle).toBeTruthy();
    expect(stackEle).toBeNull();
  });

  //Themes
  it('should apply theme to chart', () => {
    const themes = [
      'Terrestrial',
      'Annabelle',
      'Azure',
      'Retro',
      'Mellow',
      'Orient',
      'GrayScale',
      'Flyer',
      'Luminosity',
    ];
    themes.forEach((theme) => {
      const tree = render(<WmColumnChart {...baseProps} theme={theme} />);
      const viewEle = tree.UNSAFE_getByType(VictoryChart);

      const colors = viewEle.props.theme.group.colorScale;
      const themeColors = ThemeFactory.getColorsObj(theme);

      colors.map((color: string) => {
        expect(themeColors).toContain(color);
      });
    });
  });

  //victoryCharts
  it('should render victorycharts with offset styles', () => {
    const tree = render(
      <WmColumnChart
        {...baseProps}
        offsettop={10}
        offsetbottom={10}
        offsetright={10}
        offsetleft={10}
      />
    );
    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    expect(viewEle.props.padding.top).toBe(10);
    expect(viewEle.props.padding.bottom).toBe(10);
    expect(viewEle.props.padding.right).toBe(10);
    expect(viewEle.props.padding.left).toBe(10);
  });

  //showvalues
  it('if showvalue is true then label must appear', () => {
    const tree = render(<WmColumnChart {...baseProps} showvalues={true} />);
    const viewEle = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle.props.labels).toBeDefined();
  });

  it('if show value is false then labels will not appear', () => {
    const tree = render(<WmColumnChart {...baseProps} showvalues={false} />);
    const viewEle = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle.props.labels).toBeUndefined();
  });

  it('should apply custom colors to bars', () => {
    const tree = render(<WmColumnChart {...baseProps} />);
    const viewEle = tree.UNSAFE_getByType(VictoryGroup);
    expect(viewEle.props.colorScale).toEqual(baseProps.customcolors);
  });

  it('should render x-axis label', () => {
    const xaxislabel = 'x-axis-label';
    const tree = render(
      <WmColumnChart {...baseProps} xaxislabel={xaxislabel} />
    );

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const xaxis = viewEle.findAllByType(VictoryAxis);

    expect(xaxis[0].props.label).toBe(xaxislabel);
  });

  it('should render y-axis label', () => {
    const yaxislabel = 'y-axis-label';
    const tree = render(
      <WmColumnChart {...baseProps} xaxislabel={yaxislabel} />
    );

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const yaxis = viewEle.findAllByType(VictoryAxis);

    expect(yaxis[0].props.label).toBe(yaxislabel);
  });

  it('should render x-axis units in the label', () => {
    const xaxislabel = 'x-axis-label';
    const xunits = 'x-units';
    const tree = render(
      <WmColumnChart {...baseProps} xaxislabel={xaxislabel} xunits={xunits} />
    );

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const xaxis = viewEle.findAllByType(VictoryAxis);

    const expectedLabel = xaxislabel + `(${xunits})`;
    expect(xaxis[0].props.label).toBe(expectedLabel);
  });

  it('should render chart component with default data when dataset is empty', () => {
    const SAMPLE_DATA = {
      group1: '01/01/2001',
      group2: '01/01/2002',
      group3: '01/01/2003',
    };

    const tree = render(
      <WmColumnChart
        xaxisdatakey="x"
        yaxisdatakey="y"
        dataset={[]}
        type="Column"
      />
    );

    const viewEle2 = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle2.props.data[0].y).toBe(3);
    expect(viewEle2.props.data[0].x).toBe(0);
  });
});
