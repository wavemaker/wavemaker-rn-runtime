import WmTime from '@wavemaker/app-rn-runtime/components/input/epoch/time/time.component';
import WmTimeProps from '@wavemaker/app-rn-runtime/components/input/epoch/time/time.props';

import React, { ReactNode, createRef } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

import { render, fireEvent, screen } from '@testing-library/react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('react-native-safe-area-context', () => {
  return {
    useSafeAreaInsets: jest.fn().mockReturnValue({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
    SafeAreaProvider: ({ children }) => children,
  };
});

jest.mock('expo-asset');
jest.mock('expo-font');

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

const loadAsset = (path) => path;

AppModalService.modalsOpened = [];

function renderComponentWithWrappers(props = {}) {
  return render(
    <ModalProvider value={AppModalService}>
      <AssetProvider value={loadAsset}>
        <WmTime {...props} />
      </AssetProvider>
    </ModalProvider>
  );
}

describe('WmTime Component', () => {
  let props;

  beforeEach(() => {
    props = new WmTimeProps();
  });

  it('should render with default properties correctly', async () => {
    const ref = createRef();
    render(<WmTime {...props} name="time1" ref={ref} />);
    expect(screen).toMatchSnapshot();
    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer(200);

    expect(screen.getByText(props.placeholder)).toBeTruthy();
    expect(ref.current.state.showDatePicker).toBe(true);
    expect(ref.current.state.showTimePickerModal).toBe(true);
    expect(screen).toMatchSnapshot();
  });

  it('should apply the correct style class name when floatinglabel is present', () => {
    props.floatinglabel = 'Test Label';
    const ref = createRef();
    render(<WmTime {...props} name="time1" ref={ref} />);
    const className = ref.current.getStyleClassName();
    expect(className).toContain('app-time-with-label');
  });

  it('should show time picker modal on focus', async () => {
    const ref = createRef();
    const onTapMock = jest.fn();
    render(<WmTime {...props} name="time1" ref={ref} onTap={onTapMock} />);

    const timeInput = screen.getAllByTestId('time1_a')[0];

    fireEvent.press(timeInput);
    await timer(300);
    const selectDateText = screen.getByText('Select Time');
    expect(selectDateText).toBeTruthy();
    expect(screen.getByText('Select')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(onTapMock).toHaveBeenCalled();
  });

  it('should handle time change correctly - 12 hour format', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmTime
        {...props}
        name="time1"
        ref={ref}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        datepattern="hh:mm:ss a"
        outputformat="HH:mm:ss"
      />
    );

    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer(300);

    const scrollViewHour = screen.UNSAFE_getAllByType(ScrollView)[0];
    const scrollViewMinute = screen.UNSAFE_getAllByType(ScrollView)[1];
    const scrollViewMeridiem = screen.UNSAFE_getAllByType(ScrollView)[2];
    //selecting hour
    fireEvent(scrollViewHour, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewHour, 'momentumScrollEnd');

    //selecting minute
    fireEvent(scrollViewMinute, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewMinute, 'momentumScrollEnd');

    //selecting meridiem
    fireEvent(scrollViewMeridiem, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 50,
        },
      },
    });
    fireEvent(scrollViewMeridiem, 'momentumScrollEnd');

    await timer();

    fireEvent.press(screen.getByText('Select'));

    await timer(300);

    expect(ref.current.state.props.datavalue).toBe('17:04:00');
    expect(ref.current.state.displayValue).toBe('05:04:00 pm');
    expect(onChangeMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
    expect(screen.getByText('05:04:00 pm')).toBeTruthy();
  });

  it('should handle time change correctly - 24 hour format', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmTime
        {...props}
        name="time1"
        ref={ref}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        datepattern="hh:mm:ss"
        outputformat="HH:mm:ss"
      />
    );

    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer(300);

    const scrollViewHour = screen.UNSAFE_getAllByType(ScrollView)[0];
    const scrollViewMinute = screen.UNSAFE_getAllByType(ScrollView)[1];
    //selecting hour
    fireEvent(scrollViewHour, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewHour, 'momentumScrollEnd');

    //selecting minute
    fireEvent(scrollViewMinute, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewMinute, 'momentumScrollEnd');

    await timer();

    fireEvent.press(screen.getByText('Select'));

    await timer(300);

    expect(ref.current.state.props.datavalue).toBe('04:04:00');

    expect(ref.current.state.displayValue).toBe('04:04:00');
    expect(onChangeMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
    expect(screen.getByText('04:04:00')).toBeTruthy();
  });

  it('should call onFocus and onBlur correctly', async () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmTime
        {...props}
        name="time1"
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );
    const timeInput = screen.getAllByTestId('time1_a')[0];

    fireEvent.press(timeInput);
    await timer(300);

    expect(onFocusMock).toHaveBeenCalled();

    fireEvent.press(screen.getByText('Cancel'));
    await timer(300);

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('should display current time if datavalue is CURRENT_TIME', async () => {
    props.datavalue = 'CURRENT_TIME';
    props.datepattern = 'hh:mm:ss a';

    const ref = createRef();
    const hourValue = +new Date().toLocaleTimeString().substring(0, 2);
    const currTime =
      hourValue >= 10
        ? new Date().toLocaleTimeString()
        : '0' + new Date().toLocaleTimeString();

    render(<WmTime {...props} name="time1" ref={ref} />);

    await timer(300);

    expect(ref.current.state.dateValue).toBeTruthy();
    expect(ref.current.state.displayValue).toBe(currTime.toLowerCase());
    expect(screen.getByText(currTime.toLowerCase())).toBeTruthy();
  });

  it('should render FloatingLabel if the floatinglabel prop is set', () => {
    props.floatinglabel = 'Test Label';

    const { getByText } = render(<WmTime {...props} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should set showTimePickerModal to false when modal is dismissed', async () => {
    const ref = createRef();
    render(<WmTime {...props} name="time1" ref={ref} />);
    expect(screen).toMatchSnapshot();
    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer(200);
    expect(ref.current.state.showTimePickerModal).toBe(true);

    const modalEle = screen.UNSAFE_getByType(Modal);
    fireEvent(modalEle, 'dismiss');
    await timer(200);

    expect(ref.current.state.showTimePickerModal).toBe(false);
  });

  //// web cases

  it('should render timepicker when Platform.OS = "web"', async () => {
    Platform.OS = 'web';

    let userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

    window['navigator'] = { userAgent: userAgent };

    const ref = createRef();
    const hourValue = +new Date().toLocaleTimeString().substring(0, 2);
    const currTime =
      hourValue >= 10
        ? new Date().toLocaleTimeString()
        : '0' + new Date().toLocaleTimeString();

    const tree = renderComponentWithWrappers({
      ...props,
      ref,
      name: 'time1',
      datepattern: 'hh:mm:ss a',
      locale: 'en',
    });
    await timer(200);

    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer();

    const renderOptions = AppModalService.modalOptions;

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree = render(<Content />);

    const okButton = subTree.getByText('Ok');
    fireEvent.press(okButton);
    await timer(300);

    expect(ref.current.state.displayValue).toBe(currTime.toLowerCase());
    expect(tree.getByText(currTime.toLowerCase())).toBeTruthy();
  });

  it('should handle blur event and validate on web', async () => {
    const onBlurMock = jest.fn();
    const triggerValidationMock = jest.fn();

    Platform.OS = 'web';

    let userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

    window['navigator'] = { userAgent: userAgent };

    const ref = createRef();

    const tree = renderComponentWithWrappers({
      ...props,
      ref,
      name: 'time1',
      datepattern: 'hh:mm:ss a',
      locale: 'en',
      onBlur: onBlurMock,
      triggerValidation: triggerValidationMock,
    });
    await timer(200);

    const timeInput = screen.getAllByTestId('time1_a')[0];
    fireEvent.press(timeInput);

    await timer();

    const renderOptions = AppModalService.modalOptions;

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree = render(<Content />);

    const cancelButton = subTree.getByText('Cancel');
    fireEvent.press(cancelButton);
    await timer(300);

    expect(onBlurMock).toHaveBeenCalled();
    expect(triggerValidationMock).toHaveBeenCalled();
  });

   //skeleton loader
   it('should render skeleton with respect to root styles when show skeleton is true', () => {
    const tree = render(<WmTime {...props} name="time1" showskeleton={true}/>);
    const viewEles = tree.UNSAFE_getAllByType(View);
    expect(viewEles[1].props.style.width).toBe('80%');
    expect(viewEles[1].props.style.height).toBe(16);
    expect(viewEles[2].props.style.width).toBe(32);
    expect(viewEles[2].props.style.height).toBe(32);
  })
});
