import React, { createRef, useRef } from 'react';
import WmBarChart from '@wavemaker/app-rn-runtime/components/chart/bar-chart/bar-chart.component';
import WmBarChartProps from '@wavemaker/app-rn-runtime/components/chart/bar-chart/bar-chart.props';
import { render, screen, waitFor } from '@testing-library/react-native';
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
  VictoryStack,
  VictoryScatter,
  VictoryBar,
  VictoryLabel,
} from 'victory-native';
import ThemeFactory from '@wavemaker/app-rn-runtime/components/chart/theme/chart.theme';
import { act } from '@testing-library/react-native';

describe('Test BarChart component', () => {
  const baseProps: WmBarChartProps = {
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

  it('should render WmBarChart component correctly', () => {
    const tree = render(
      <WmBarChart
        name="test_BarChart"
        dataset={baseProps.dataset}
        xaxisdatakey={baseProps.xaxisdatakey}
        yaxisdatakey={baseProps.yaxisdatakey}
        title={baseProps.title}
        subheading={baseProps.subheading}
      />
    ).toJSON();
    expect(tree).not.toBeNull();
  });

  it('should render with null when default props was not given', () => {
    const tree = render(<WmBarChart />);

    expect(Array.isArray(tree.toJSON())).toBe(false);
    expect(tree.toJSON().children).toBeNull();
  });

  it('should render bar chart with given title & subheading', () => {
    const tree = render(<WmBarChart {...baseProps} />);

    expect(screen.getByText(baseProps.title)).toBeTruthy();
    expect(screen.getByText(baseProps.subheading)).toBeTruthy();
  });

  it('should render title with icon', () => {
    const tree = render(<WmBarChart {...baseProps} iconclass="fa fa-edit" />);
    expect(screen.getByText(baseProps.title)).toBeTruthy();
    expect(screen.getByText('edit')).toBeTruthy();
  });
  it('should not render title section when title prop is not provided', () => {
    const tree = render(
      <WmBarChart
        dataset={baseProps.dataset}
        xaxisdatakey={baseProps.xaxisdatakey}
        yaxisdatakey={baseProps.yaxisdatakey}
        // title is intentionally not provided
        subheading="Only Subheading"
      />
    );
    
    // Title should not be found
    expect(screen.queryByText('Sample Bar Chart')).toBeNull();
    
    // The title container (flex row) should not be rendered
    const flexRowContainers = tree.UNSAFE_queryAllByProps({
      style: { flexDirection: 'row', alignItems: 'center' }
    });
    expect(flexRowContainers.length).toBe(0);
    
    // Subheading should still be visible
    expect(screen.getByText('Only Subheading')).toBeTruthy();
  });
  
  it('should not render subheading when subheading prop is not provided', () => {
    const tree = render(
      <WmBarChart
        dataset={baseProps.dataset}
        xaxisdatakey={baseProps.xaxisdatakey}
        yaxisdatakey={baseProps.yaxisdatakey}
        title="Only Title"
        // subheading is intentionally not provided
      />
    );
    
    // Title should be visible
    expect(screen.getByText('Only Title')).toBeTruthy();
    
    // Subheading should not be found
    expect(screen.queryByText('This is a test bar chart')).toBeNull();
  });
  
  it('should render both title and subheading when both props are provided', () => {
    const tree = render(
      <WmBarChart
        dataset={baseProps.dataset}
        xaxisdatakey={baseProps.xaxisdatakey}
        yaxisdatakey={baseProps.yaxisdatakey}
        title="Custom Title"
        subheading="Custom Subheading"
      />
    );
    
    // Both title and subheading should be visible
    expect(screen.getByText('Custom Title')).toBeTruthy();
    expect(screen.getByText('Custom Subheading')).toBeTruthy();
  });
  it('should handle beforeRender event callback', () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmBarChart.prototype,
      'invokeEventCallback'
    );
    const onBeforerenderMock = jest.fn();
    const tree = render(
      <WmBarChart {...baseProps} onBeforerender={onBeforerenderMock} />
    );
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onBeforerender',
      expect.anything()
    );
    expect(onBeforerenderMock).toHaveBeenCalled();
    expect(invokeEventCallbackMock).toHaveBeenCalled();
    expect(invokeEventCallbackMock).toHaveBeenCalledWith(
      'onBeforerender',
      expect.anything()
    );
  });

  it('should handle on Transform event callback', () => {
    const invokeEventCallbackMock = jest.spyOn(
      WmBarChart.prototype,
      'invokeEventCallback'
    );
    const onTransformMock = jest.fn();
    const tree = render(
      <WmBarChart {...baseProps} onTransform={onTransformMock} />
    );

    expect(onTransformMock).toHaveBeenCalled();
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
      WmBarChart.prototype,
      'invokeEventCallback'
    );
    const barRef: any = createRef();
    const onSelectMock = jest.fn();
    render(<WmBarChart {...baseProps} ref={barRef} onSelect={onSelectMock} />);

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

    expect(onSelectMock).toHaveBeenCalled();
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
      <WmBarChart
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
      <WmBarChart {...baseProps} show="false" accessibilityrole="BarChart" />
    );
    const viewEle = screen.getByRole('BarChart');
    expect(viewEle.props.style.width).toBe(0);
    expect(viewEle.props.style.height).toBe(0);
  });

  it('should render tooltip on select', async () => {
    const getTooltipMock = jest.spyOn(WmBarChart.prototype, 'getTooltip');
    const customRef = createRef<WmBarChart>();
    const { getByText } = render(<WmBarChart {...baseProps} ref={customRef} />);

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
  it('should render legend when showlegend is not "hide"', () => {
    const tree = render(<WmBarChart {...baseProps} showlegend="bottom" />);
    const viewEle = tree.UNSAFE_getByType(VictoryLegend);

    expect(viewEle).toBeTruthy();
  });

  it('showlegend set to hidden', async () => {
    const tree = render(<WmBarChart {...baseProps} showlegend="hide" />);
    const viewEle = tree.UNSAFE_queryByType(VictoryLegend);
    expect(viewEle).toBeNull();
  });

  it('should render the chart with stacked viewtype', () => {
    const tree = render(<WmBarChart {...baseProps} viewtype="Stacked" />);
    const stackEle = tree.UNSAFE_getByType(VictoryStack);
    const groupEle = tree.UNSAFE_queryByType(VictoryGroup);
    expect(stackEle).toBeTruthy();
    expect(groupEle).toBeNull();
  });

  it('should render the chart with grouped viewtype', () => {
    const tree = render(<WmBarChart {...baseProps} viewtype="Grouped" />);
    const groupEle = tree.UNSAFE_getByType(VictoryGroup);
    const stackEle = tree.UNSAFE_queryByType(VictoryStack);
    expect(groupEle).toBeTruthy();
    expect(stackEle).toBeNull();
  });

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
      const tree = render(<WmBarChart {...baseProps} theme={theme} />);
      const viewEle = tree.UNSAFE_getByType(VictoryChart);

      const colors = viewEle.props.theme.group.colorScale;
      const themeColors = ThemeFactory.getColorsObj(theme);

      colors.map((color: string) => {
        expect(themeColors).toContain(color);
      });
    });
  });

  it('should render victorycharts with offset styles', () => {
    const tree = render(
      <WmBarChart
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

  it('should pass labels to chart on show values', () => {
    const tree = render(<WmBarChart {...baseProps} showvalues={true} />);
    const viewEle = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle.props.labels).toBeDefined();
  });

  it("shouldn't pass labels on show values is false", () => {
    const tree = render(<WmBarChart {...baseProps} showvalues={false} />);
    const viewEle = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle.props.labels).toBeUndefined();
  });

  it('should apply custom colors to bars', () => {
    const tree = render(<WmBarChart {...baseProps} />);
    const viewEle = tree.UNSAFE_getByType(VictoryGroup);
    expect(viewEle.props.colorScale).toEqual(baseProps.customcolors);
  });

  it('should render x-axis label', () => {
    const xaxislabel = 'x-axis-label';
    const tree = render(<WmBarChart {...baseProps} xaxislabel={xaxislabel} />);

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const xaxis = viewEle.findAllByType(VictoryAxis);

    expect(xaxis[0].props.label).toBe(xaxislabel);
  });

  it('should render y-axis label', () => {
    const yaxislabel = 'y-axis-label';
    const tree = render(<WmBarChart {...baseProps} xaxislabel={yaxislabel} />);

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const yaxis = viewEle.findAllByType(VictoryAxis);

    expect(yaxis[0].props.label).toBe(yaxislabel);
  });

  it('should render x-axis units in the label', () => {
    const xaxislabel = 'x-axis-label';
    const xunits = 'x-units';
    const tree = render(
      <WmBarChart {...baseProps} xaxislabel={xaxislabel} xunits={xunits} />
    );

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const xaxis = viewEle.findAllByType(VictoryAxis);

    const expectedLabel = xaxislabel + `(${xunits})`;
    expect(xaxis[0].props.label).toBe(expectedLabel);
  });

  it('should render y-axis label distance', () => {
    const yaxislabeldistance = 5;
    const tree = render(
      <WmBarChart {...baseProps} yaxislabeldistance={yaxislabeldistance} />
    );

    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    const yaxis = viewEle.findAllByType(VictoryAxis);

    expect(yaxis[0].props.axisLabelComponent.props.y).toBe(yaxislabeldistance);
  });

  it('should show x-axis', () => {
    const getYAxisSpy = jest.spyOn(WmBarChart.prototype, 'getYAxis');
    const tree = render(<WmBarChart {...baseProps} showxaxis={false} />);
    expect(getYAxisSpy).toHaveBeenCalled();
    expect(getYAxisSpy).not.toHaveReturnedWith(null);
    getYAxisSpy.mockRestore();
  });

  it('should show y-axis', () => {
    const getYAxisSpy = jest.spyOn(WmBarChart.prototype, 'getYAxis');
    const tree = render(<WmBarChart {...baseProps} showyaxis={true} />);
    expect(getYAxisSpy).toHaveBeenCalled();
    expect(getYAxisSpy).not.toHaveReturnedWith(null);
    getYAxisSpy.mockRestore();
  });

  it("shouldn't show y-axis", () => {
    const getYAxisSpy = jest.spyOn(WmBarChart.prototype, 'getYAxis');
    const tree = render(<WmBarChart {...baseProps} showyaxis={false} />);
    expect(getYAxisSpy).toHaveBeenCalled();
    expect(getYAxisSpy).toHaveReturnedWith(null);
    getYAxisSpy.mockRestore();
  });

  it('should have width and height', () => {
    const tree = render(
      <WmBarChart
        {...baseProps}
        styles={{
          root: { width: 500, height: 500 },
          text: {
            color: 'red',
          },
        }}
      />
    );
    const viewEle = tree.UNSAFE_getByType(VictoryChart);
    expect(screen).toMatchSnapshot();
  });

  it('should render chart component with default data when dataset is empty', () => {
    const tree = render(
      <WmBarChart
        {...baseProps}
        xaxisdatakey="x"
        yaxisdatakey="y"
        dataset={[]}
        type="Bar"
      />
    );

    const viewEle2 = tree.UNSAFE_getByType(VictoryBar);
    expect(viewEle2.props.data[0].y).toBe(2000000);
    expect(viewEle2.props.data[1].y).toBe(1000000);
    expect(viewEle2.props.data[2].y).toBe(3000000);
    expect(viewEle2.props.data[0].x).toBe(0);
    expect(viewEle2.props.data[1].x).toBe(1);
    expect(viewEle2.props.data[2].x).toBe(2);
  });

  it('should not render title and icon container when both props are missing', () => {
    const { queryByTestId } = renderComponent({
      ...defaultProps,
      // title and iconclass are intentionally not provided
    });
    
    // The container View should not be rendered
    expect(queryByTestId('title-icon-container')).toBeNull();
  });

  it('should render only icon when iconclass is provided without title', () => {
    const { getByText, queryByText } = renderComponent({
      ...defaultProps,
      iconclass: 'fa fa-edit',
      // title is intentionally not provided
    });
    
    // Icon should be rendered
    expect(getByText('edit')).toBeTruthy();
    
    // Title should not be rendered
    expect(queryByText('Bar Chart')).toBeNull();
  });

  it('should apply correct container styles for title and icon', () => {
    const { getByTestId } = renderComponent({
      ...defaultProps,
      title: 'Test Title',
      iconclass: 'fa fa-edit',
    });
    
    const container = getByTestId('title-icon-container');
    expect(container.props.style.flexDirection).toBe('row');
    expect(container.props.style.alignItems).toBe('center');
  });

  it('should render title with custom styles', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      title: 'Custom Title',
      styles: {
        title: {
          color: 'red',
          fontSize: 20,
          fontWeight: 'bold'
        }
      }
    });
    
    const titleElement = getByText('Custom Title');
    expect(titleElement.props.style.color).toBe('red');
    expect(titleElement.props.style.fontSize).toBe(20);
    expect(titleElement.props.style.fontWeight).toBe('bold');
  });

  it('should render icon with custom styles', () => {
    const { getByText } = renderComponent({
      ...defaultProps,
      iconclass: 'fa fa-edit',
      styles: {
        icon: {
          icon: {
            color: 'blue',
            fontSize: 24
          }
        }
      }
    });
    
    const iconElement = getByText('edit');
    expect(iconElement.props.style[1].color).toBe('blue');
    expect(iconElement.props.style[1].fontSize).toBe(24);
  });

  it('should maintain container styles when title or icon changes', () => {
    const { getByTestId, rerender } = renderComponent({
      ...defaultProps,
      title: 'Initial Title',
      iconclass: 'fa fa-edit'
    });
    
    const container = getByTestId('title-icon-container');
    const initialStyles = container.props.style;
    
    // Rerender with different title and icon
    rerender(
      <WmBarChart
        {...defaultProps}
        title="New Title"
        iconclass="fa fa-trash"
      />
    );
    
    const newContainer = getByTestId('title-icon-container');
    expect(newContainer.props.style).toEqual(initialStyles);
  });
});
