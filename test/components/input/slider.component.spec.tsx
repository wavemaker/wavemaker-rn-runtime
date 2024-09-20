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

//rendering the component
const renderComponent = (props = {}) => {
  return render(
    <WmSlider
      name="test_Slider"
      {...props}
      dataset={dataset}
      displayfield="x"
      datafield="y"
    />
  );
};

const fireEventLayoutFun = (props) => {
  return fireEvent(props.getByTestId('test_Slider'), 'layout', {
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
  it('should update position on track gesture', () => {
    const onChangeMock = jest.fn();
    const { getByTestId } = renderSlider({
      onChange: onChangeMock,
      dataset: [],
      datatype: 'dataset',
      name: 'test',
    });
    expect(screen).toMatchSnapshot();
    const track = getByTestId('test_sliderTouchable');

    // Simulate a pan gesture on the track
    fireEvent(track, 'onGestureEvent', {
      nativeEvent: { x: 50 },
    });

    // Add assertions to check if the position has been updated
    expect(onChangeMock).toHaveBeenCalled();
    // You might need to adjust this based on how your component updates and reports changes
  });
  it('should render the slider component ', () => {
    const tree = renderComponent();
    expect(tree).toMatchSnapshot();
    expect(tree).toBeDefined();
    expect(tree).not.toBeNull();
  });

  it('should render text with respect to displayfield of dataItems', () => {
    const viewEle = jest.spyOn(WmSlider.prototype, 'renderOldMarkerStyle');
    const getScaledDataValueEle = jest.spyOn(
      WmSlider.prototype,
      'getScaledDataValue'
    );
    renderComponent();
    expect(viewEle).toHaveBeenCalled();
    expect(getScaledDataValueEle).toHaveBeenCalled();
    expect(screen.getByText(`${dataset[0].x}`)).toBeTruthy();
    expect(screen.getByText(`${dataset[2].x}`)).toBeTruthy();
  });

  it('should render track styles', () => {
    const viewEle = jest.spyOn(WmSlider.prototype, 'renderTracks');

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
    expect(viewEle).toHaveBeenCalledTimes(1);
    expect(touchableEle).toBeTruthy();
    expect(touchableEle.props.style.borderRadius).toBe(10);
    expect(touchableEle.props.style.overflow).toBe('hidden');
    expect(touchableEle.props.style.marginVertical).toBe(12);
    expect(touchableEle.props.style.minWidth).toBe(180);
    expect(touchableEle.props.style.width).toBe('100%');
    expect(touchableEle.props.style.height).toBe(14);
    expect(touchableEle.props.style.flexDirection).toBe('row');
  });

  it('should render minimumTrack styles of animatedView', () => {
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

  it('should render text ,when renderMarkers method is called', async () => {
    const tree = renderComponent({
      showmarkers: true,
    });
    fireEventLayoutFun(tree);

    await waitFor(() => {
      expect(screen).toMatchSnapshot();
      expect(tree.getByText('10'));
      expect(tree.getByText('20'));
      expect(tree.getByText('30'));
    });
  });

  it('should render the WmTooltip when renderToolTip function is called', () => {
    const renderToolTipsMock = jest.spyOn(WmSlider.prototype, 'renderToolTips');

    const tree = renderComponent({
      showtooltip: true,
    });

    expect(renderToolTipsMock).toHaveBeenCalled(); //defaulty it is calling
    expect(tree.getByText('10')).toBeTruthy();

    const viewEle = tree.UNSAFE_getByType(WmTooltip);
    expect(viewEle).toBeDefined();
    expect(viewEle.props.showTooltip).toBe(true);
    expect(viewEle.props.text).toBe(dataset[0].x);
    expect(viewEle.props.direction).toBe('up');
  });

  it('should render children of WmToolTip when renderToolTip function is called, defaultly', () => {
    const tree = renderComponent({
      showtooltip: true,
    });

    expect(tree.getByLabelText('Thumb')).toBeTruthy(); //accessibilityLabel is in Animated View

    const backgroundEle = tree.UNSAFE_getAllByType(BackgroundComponent); //children of Animated View
    expect(backgroundEle.length).toBe(2);
  });

  //pending
  it('when dataset length is greaterthan 1 then getScaledDataValue should return the dataset', () => {
    const getScaledDataValueMock = jest.spyOn(
      WmSlider.prototype,
      'getScaledDataValue'
    );
    render(
      <WmSlider name="test_Slider" datatype="dataset" dataset={undefined} />
    );
  });

  //show
  it('when show is false width and height set to be zero', () => {
    const tree = renderComponent({ show: false });
    const rootElement = screen.root;
    expect(rootElement.props.style.width).toBe(0);
    expect(rootElement.props.style.height).toBe(0);
  });

  //  ************************* dataType == number ************************************************

  it('should render component when datatype is number', async () => {
    const ref = createRef<WmSlider>();
    const tree = render(
      <WmSlider
        name="test_Slider"
        datatype="number"
        dataset={[]}
        maxvalue={10}
        displayfield="x"
        datafield="y"
        showmarkers={true}
        ref={ref}
      />
    );
    fireEventLayoutFun(tree);
    await waitFor(() => {
      // expect(tree.queryByTestId('renderMarkerschild')).not.toBeNull()
      // console.log(ref.current.state);
      expect(tree.queryByTestId('textfield')).not.toBeNull();
      expect(screen).toMatchSnapshot();
    });
  });

  //pending

  it('when datatype is number then initNumericSlider should be called', () => {
    const initNumericSliderMock = jest.spyOn(
      WmSlider.prototype,
      'initNumericSlider'
    );
    render(<WmSlider name="test_Slider" datatype="number" dataset={[]} />);
    expect(initNumericSliderMock).toHaveBeenCalled();
  });
});
