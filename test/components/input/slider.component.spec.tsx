import React, { createRef, ReactNode } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import WmTooltip from '@wavemaker/app-rn-runtime/components/basic/tooltip/tooltip.component';
import WmSlider from '@wavemaker/app-rn-runtime/components/input/slider/slider.component';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WmSliderProps from '@wavemaker/app-rn-runtime/components/input/slider/slider.props';
// import { gestureHandlerRootHOC } from 'react-native-gesture-handler/jest-utils';

// jest.mock('react-native-gesture-handler', () => {
//   const actual = jest.requireActual('react-native-gesture-handler');
//   return {
//     ...actual,
//     Gesture: {
//       Pan: jest.fn(() => ({
//         onUpdate: jest.fn().mockReturnThis(),
//         onChange: jest.fn().mockReturnThis(),
//         onEnd: jest.fn().mockReturnThis(),
//         maxPointers: jest.fn().mockReturnThis(),
//         minDistance: jest.fn().mockReturnThis(),
//       })),
//     },
//   };
// });

const dataset = [
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
const defProps = new WmSliderProps();

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

//rendering the component
const renderComponent = (props = {}) => {
  return render(
    <WmSlider
      {...defProps}
      datatype="dataset"
      name="test_Slider"
      dataset={dataset}
      displayfield="x"
      datafield="y"
      {...props}
    />
  );
};

const fireEventLayoutFun = (tree: any) => {
  return fireEvent(tree.getByTestId('test_Slider'), 'layout', {
    nativeEvent: {
      layout: {
        x: 100,
        y: 100,
        top: 100,
        left: 100,
        width: 200,
        height: 200,
      },
    },
  });
};

const renderSlider = (props = {}) => {
  return render(
    <GestureHandlerRootView>
      <WmSlider {...props} />
    </GestureHandlerRootView>
  );
};
describe('Test Slider component', () => {
  // it('should update position on track gesture', () => {
  //   const onChangeMock = jest.fn();
  //   const { getByTestId } = renderSlider({
  //     onChange: onChangeMock,
  //     dataset: [],
  //     datatype: 'dataset',
  //     name: 'test',
  //   });
  //   expect(screen).toMatchSnapshot();
  //   const track = getByTestId('test_sliderTouchable');

  //   // Simulate a pan gesture on the track
  //   fireEvent(track, 'onGestureEvent', {
  //     nativeEvent: { x: 50 },
  //   });

  //   // Add assertions to check if the position has been updated
  //   expect(onChangeMock).toHaveBeenCalled();
  //   // You might need to adjust this based on how your component updates and reports changes
  // });

  it('should render the slider component ', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
  });

  it('should render max and min value out of displayfield values as range markers when showmarkers and showtips is false', () => {
    const renderOldMarkerStyleMock = jest.spyOn(
      WmSlider.prototype,
      'renderOldMarkerStyle'
    );
    const getScaledDataValueEle = jest.spyOn(
      WmSlider.prototype,
      'getScaledDataValue'
    );
    renderComponent();
    expect(renderOldMarkerStyleMock).toHaveBeenCalled();
    expect(getScaledDataValueEle).toHaveBeenCalled();
    expect(screen.getByText(`${dataset[0].x}`)).toBeTruthy();
    expect(screen.getByText(`${dataset[2].x}`)).toBeTruthy();
  });

  it('should render styles applied thru "track" class properly', () => {
    const renderTracksMock = jest.spyOn(WmSlider.prototype, 'renderTracks');

    renderComponent({
      styles: {
        track: {
          position: 'relative',
          height: 14,
          flexDirection: 'row',
          width: '100%',
          minWidth: 180,
          marginVertical: 12,
          overflow: 'hidden',
          borderRadius: 10,
        },
      },
    });
    const touchableEle = screen.getByTestId('test_Slider');
    expect(renderTracksMock).toHaveBeenCalledTimes(1);
    expect(touchableEle).toBeTruthy();
    expect(touchableEle.props.style.borderRadius).toBe(10);
    expect(touchableEle.props.style.overflow).toBe('hidden');
    expect(touchableEle.props.style.marginVertical).toBe(12);
    expect(touchableEle.props.style.minWidth).toBe(180);
    expect(touchableEle.props.style.width).toBe('100%');
    expect(touchableEle.props.style.height).toBe(14);
    expect(touchableEle.props.style.flexDirection).toBe('row');
  });

  it('should render styles applied thru "minimumTrack" class properly', () => {
    renderComponent({
      styles: {
        minimumTrack: {
          position: 'absolute',
          height: '100%',
          backgroundColor: 'red',
          width: 300,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 20,
        },
      },
    });
    const animatedViewEle = screen.getByTestId('test_Slider').children;
    expect(animatedViewEle.length).toBe(3);
    expect(animatedViewEle[0].props.style[0].position).toBe('absolute');
    expect(animatedViewEle[0].props.style[0].height).toBe('100%');
    expect(animatedViewEle[0].props.style[0].width).toBe(300);
    expect(animatedViewEle[0].props.style[0].backgroundColor).toBe('red');
    expect(animatedViewEle[0].props.style[0].borderTopLeftRadius).toBe(10);
    expect(animatedViewEle[0].props.style[0].borderBottomLeftRadius).toBe(20);
  });

  it('should render markers when "showmarkers" is true', async () => {
    const tree = renderComponent({
      showmarkers: true,
    });

    fireEventLayoutFun(tree);

    await waitFor(() => {
      expect(tree.getByText('10'));
      expect(tree.getByText('20'));
      expect(tree.getByText('30'));
    });
  });

  it('should render tooltips when "showtooltip" is true', () => {
    const renderToolTipsMock = jest.spyOn(WmSlider.prototype, 'renderToolTips');

    const tree = renderComponent({
      showtooltip: true,
    });

    expect(renderToolTipsMock).toHaveBeenCalled();
    expect(tree.getByText('10')).toBeTruthy();

    const viewEle = tree.UNSAFE_getByType(WmTooltip);
    expect(viewEle).toBeDefined();
    expect(viewEle.props.showTooltip).toBe(true);
    expect(viewEle.props.text).toBe(dataset[0].x);
    expect(viewEle.props.direction).toBe('up');
  });

  xit('should handle sliderValue change properly', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onFieldChangeMock = jest.fn();
    const dataVal = 101;

    const tree = renderComponent({
      ref,
      datavalue: dataVal,
      onChange: onChangeMock,
      onFieldChange: onFieldChangeMock,
    });

    ref.current.proxy.onSliderChange(201, 'track');

    await timer(300);
    expect(onFieldChangeMock).toHaveBeenCalled();
    // expect(onFieldChangeMock).toHaveBeenCalledWith('datavalue', 250, 200);
    expect(onChangeMock).toHaveBeenCalled();
    expect(ref.current.state.props.datavalue).toBe(201);
  });

  xit('should handle sliderValue change properly when range is true', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onFieldChangeMock = jest.fn();

    const tree = renderComponent({
      ref,
      range: true,
      datavalue: [201, 301],
      onChange: onChangeMock,
      onFieldChange: onFieldChangeMock,
    });

    ref.current.proxy.onSliderChange(101, 'lowThumb');
    await timer(500);
    expect(onFieldChangeMock).toHaveBeenCalled();
    // expect(onFieldChangeMock).toHaveBeenCalledWith('datavalue', 250, 200);
    expect(onChangeMock).toHaveBeenCalled();

    ref.current.proxy.onSliderChange(201, 'highThumb');
    await timer(300);
    expect(onFieldChangeMock).toHaveBeenCalled();
    // expect(onFieldChangeMock).toHaveBeenCalledWith('datavalue', 250, 200);
    expect(onChangeMock).toHaveBeenCalled();
  });

  //show
  it('should handle show property properly', async () => {
    const ref = createRef();
    const tree = renderComponent({ show: true, ref });
    const rootElement = tree.root;
    expect(rootElement.props.style.width).not.toBe(0);
    expect(rootElement.props.style.height).not.toBe(0);

    ref.current.proxy.show = false;
    await timer();

    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  // datatype = number cases

  xit('should render component when datatype is number', async () => {
    const ref = createRef<WmSlider>();
    const tree = render(
      <WmSlider
        {...defProps}
        name="test_Slider"
        datatype="number"
        dataset={[]}
        // datavalue={10}
        ref={ref}
      />
    );

    // ref.current.state.props.dataset = [];
    fireEventLayoutFun(tree);

    await timer(300);

    // ref.current.proxy.renderOldMarkerStyle(defProps);
    // expect(tree).toMatchSnapshot();

    await waitFor(() => {
      // expect(tree.queryByTestId('renderMarkerschild')).not.toBeNull()
      // console.log(ref.current.state);
      expect(tree.getByText('0')).toBeTruthy();
    });
  });

  it('should render marker labels as titles separated by commas', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = 'Title 1, Title 2, Title 3';
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 2,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();

    await waitFor(() => {   
      expect(tree.getByText('Title 1')).toBeTruthy();
      expect(tree.getByText('Title 2')).toBeTruthy();
      expect(tree.getByText('Title 3')).toBeTruthy();
    })
  });

  it('should render marker labels as an array of strings', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = ['Title 1', 'Title 2', 'Title 3'];
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 2,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();


    await waitFor(()=>{
      expect(tree.getByText('Title 1')).toBeTruthy();
      expect(tree.getByText('Title 2')).toBeTruthy();
      expect(tree.getByText('Title 3')).toBeTruthy();
    })
  });

  it('should render marker labels as an array of numbers', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = [10, 20, 30];
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 2,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();

    await waitFor(() => {
      expect(tree.getByText('10')).toBeTruthy();
      expect(tree.getByText('20')).toBeTruthy();
      expect(tree.getByText('30')).toBeTruthy();
    })
  });

  it('should render marker labels as an array of objects with title and position properties', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = [
      { title: 'Title 1', position: 'up' },
      { title: 'Title 2', position: 'down' },
      { title: 'Title 3', position: 'up' },
    ];
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 2,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();

    expect(tree.getByText('Title 1')).toBeTruthy();
    expect(tree.getByText('Title 2')).toBeTruthy();
    expect(tree.getByText('Title 3')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('should render marker labels as an array, having objects with title and position properties, strings and numbers', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = [
      { title: 'Title 1', position: 'up' },
      { title: 'Title 2', position: 'down' },
      { title: 'Title 3', position: 'up' },
      'Title 4',
      5,
      'Title 6',
      7
    ];
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 6,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();

    expect(tree.getByText('Title 1')).toBeTruthy();
    expect(tree.getByText('Title 2')).toBeTruthy();
    expect(tree.getByText('Title 3')).toBeTruthy();
    expect(tree.getByText('Title 4')).toBeTruthy();
    expect(tree.getByText('5')).toBeTruthy();
    expect(tree.getByText('Title 6')).toBeTruthy();
    expect(tree.getByText('7')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });

  it('should render marker labels as numbers if some of the label texts are missing in the props', async () => {
    const customRef = React.createRef<WmSlider>();
    const markerLabelText = [
      { title: 'Title 1', position: 'up' },
      { title: 'Title 2', position: 'down' },
      { title: 'Title 3', position: 'up' },
    ];
    const tree = renderComponent({
      ref: customRef,
      markerlabeltext: markerLabelText,
      dataset: null,
      minvalue: 0,
      maxvalue: 4,
      step: 1,
      showmarkers: true,
      datatype: 'number'
    });

    fireEventLayoutFun(tree);
    customRef.current.refresh();
    await timer(300);
    customRef.current.refresh();

    expect(tree.getByText('Title 1')).toBeTruthy();
    expect(tree.getByText('Title 2')).toBeTruthy();
    expect(tree.getByText('Title 3')).toBeTruthy();
    expect(tree.getByText('3')).toBeTruthy();
    expect(tree.getByText('4')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
