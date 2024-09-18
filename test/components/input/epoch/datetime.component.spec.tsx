import WmDatetime from '@wavemaker/app-rn-runtime/components/input/epoch/datetime/datetime.component';

import React, { ReactNode, createRef } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import WmDatetimeProps from '@wavemaker/app-rn-runtime/components/input/epoch/datetime/datetime.props';
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
        <WmDatetime {...props} />
      </AssetProvider>
    </ModalProvider>
  );
}

describe('WmDate Component', () => {
  let props;

  beforeEach(() => {
    props = new WmDatetimeProps();
  });

  it('should render with default properties correctly', async () => {
    const ref = createRef();
    render(<WmDatetime {...props} name="datetime1" ref={ref} />);
    const datetimeInput = screen.getAllByTestId('datetime1_a')[0];
    fireEvent.press(datetimeInput);

    await timer(200);

    expect(screen.getByText(props.placeholder)).toBeTruthy();
    expect(ref.current.state.showDatePicker).toBe(true);
    expect(ref.current.state.showDatePickerModal).toBe(true);
    expect(screen).toMatchSnapshot();
  });

  it('should apply the correct style class name when floatinglabel is present', () => {
    props.floatinglabel = 'Test Label';
    const ref = createRef();
    render(<WmDatetime {...props} name="datetime1" ref={ref} />);
    const className = ref.current.getStyleClassName();
    expect(className).toContain('app-datetime-with-label');
  });

  it('should show date picker modal on focus', async () => {
    const ref = createRef();
    const onTapMock = jest.fn();
    render(
      <WmDatetime {...props} name="datetime1" ref={ref} onTap={onTapMock} />
    );

    const datetimeInput = screen.getAllByTestId('datetime1_a')[0];

    fireEvent.press(datetimeInput);
    await timer(300);
    const selectDateText = screen.getByText('Select Date');
    expect(selectDateText).toBeTruthy();
    expect(screen.getByText('Select')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(onTapMock).toHaveBeenCalled();
  });

  it('should handle date and time change correctly', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmDatetime
        {...props}
        name="datetime1"
        ref={ref}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        datepattern="MMM d, y hh:mm:ss a"
      />
    );

    const datetimeInput = screen.getAllByTestId('datetime1_a')[0];
    fireEvent.press(datetimeInput);

    await timer(300);

    expect(screen.getByText('Select Date'));

    const scrollViewDate = screen.UNSAFE_getAllByType(ScrollView)[0];
    const scrollViewMonth = screen.UNSAFE_getAllByType(ScrollView)[1];
    const scrollViewYear = screen.UNSAFE_getAllByType(ScrollView)[2];
    //selecting date
    fireEvent(scrollViewDate, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewDate, 'momentumScrollEnd');

    //selecting month
    fireEvent(scrollViewMonth, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewMonth, 'momentumScrollEnd');

    //selecting year
    fireEvent(scrollViewYear, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 2000,
        },
      },
    });
    fireEvent(scrollViewYear, 'momentumScrollEnd');

    await timer();

    fireEvent.press(screen.getByText('Select'));

    await timer(300);

    expect(ref.current.state.props.datavalue).toBe('641845800000');
    expect(ref.current.state.dateValue.toISOString()).toBe(
      '1990-05-04T18:30:00.000Z'
    );

    expect(ref.current.state.displayValue).toBe('May 5, 1990 12:00:00 am');
    expect(onChangeMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
    expect(screen.getByText('May 5, 1990 12:00:00 am')).toBeTruthy();

    expect(screen.getByText('Select Time'));

    const scrollViewHour = screen.UNSAFE_getAllByType(ScrollView)[0];
    const scrollViewMinute = screen.UNSAFE_getAllByType(ScrollView)[1];
    const scrollViewMeridiem = screen.UNSAFE_getAllByType(ScrollView)[2];

    //selecting date
    fireEvent(scrollViewHour, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewHour, 'momentumScrollEnd');

    //selecting month
    fireEvent(scrollViewMinute, 'scroll', {
      nativeEvent: {
        contentOffset: {
          x: 100,
          y: 200,
        },
      },
    });
    fireEvent(scrollViewMinute, 'momentumScrollEnd');

    //selecting year
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

    expect(ref.current.state.props.datavalue).toBe('641907240000');
    expect(ref.current.state.dateValue.toISOString()).toBe(
      '1990-05-05T11:34:00.000Z'
    );
    expect(ref.current.state.displayValue).toBe('May 5, 1990 05:04:00 pm');
    expect(onChangeMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
    expect(screen.getByText('May 5, 1990 05:04:00 pm')).toBeTruthy();
    expect(onChangeMock).toHaveBeenCalledTimes(3);
    expect(onBlurMock).toHaveBeenCalledTimes(2);
  });

  it('should call onFocus and onBlur correctly', async () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmDatetime
        {...props}
        name="datetime1"
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );
    const datetimeInput = screen.getAllByTestId('datetime1_a')[0];

    fireEvent.press(datetimeInput);
    await timer(300);

    expect(onFocusMock).toHaveBeenCalled();

    fireEvent.press(screen.getByText('Cancel'));
    await timer(300);

    expect(onBlurMock).toHaveBeenCalled();
  });

  it('should display current date if datavalue is CURRENT_DATE', async () => {
    props.datavalue = 'CURRENT_DATE';
    props.datepattern = 'yyyy-MM-dd';
    const ref = createRef();
    const currDate = new Date()
      .toLocaleDateString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .split('/')
      .reverse()
      .join('-');
    render(<WmDatetime {...props} name="datetime1" ref={ref} />);

    await timer(300);

    expect(ref.current.state.dateValue).toBeTruthy();
    expect(ref.current.state.displayValue).toBe(currDate);
    expect(screen.getByText(currDate)).toBeTruthy();
  });

  it('should handle minimum date property correctly', () => {
    const minDate = new Date(2022, 7, 10).toISOString();
    const ref = createRef();
    const currDate = new Date().toISOString().split('T')[0];

    render(
      <WmDatetime {...props} name="datetime1" mindate={minDate} ref={ref} />
    );

    expect(ref.current.state.props.mindate.toISOString()).toEqual(minDate);

    render(
      <WmDatetime
        {...props}
        name="datetime1"
        mindate="CURRENT_DATE"
        ref={ref}
      />
    );

    expect(ref.current.state.props.mindate.toISOString().split('T')[0]).toEqual(
      currDate
    );
  });

  it('should handle maximum date property correctly', () => {
    const maxDate = new Date(2024, 7, 10).toISOString();
    const ref = createRef();
    const currDate = new Date().toISOString().split('T')[0];

    render(
      <WmDatetime {...props} name="datetime1" maxdate={maxDate} ref={ref} />
    );

    expect(ref.current.state.props.maxdate.toISOString()).toEqual(maxDate);

    render(
      <WmDatetime
        {...props}
        name="datetime1"
        maxdate="CURRENT_DATE"
        ref={ref}
      />
    );

    expect(ref.current.state.props.maxdate.toISOString().split('T')[0]).toEqual(
      currDate
    );
  });

  it('should render FloatingLabel if the floatinglabel prop is set', () => {
    props.floatinglabel = 'Test Label';

    const { getByText } = render(<WmDatetime {...props} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  //// web cases

  it('should render datetimepicker when Platform.OS = "web"', async () => {
    Platform.OS = 'web';

    let userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

    window['navigator'] = { userAgent: userAgent };

    const ref = createRef();

    const options = {
      month: 'short', // "Sep"
      day: 'numeric', // "2"
      year: 'numeric', // "2024"
      hour: '2-digit', // "03"
      minute: '2-digit', // "56"
      // second: '2-digit', // "37"
      hour12: true, // 24-hour format, removing "AM"/"PM"
    };

    const currDateTime = new Date()
      .toLocaleString('en-US', options)
      .replace(',', '');

    const tree = renderComponentWithWrappers({
      ...props,
      ref,
      name: 'datetime1',
      datepattern: 'MMM d y, hh:mm a',
      locale: 'en',
    });
    await timer(200);

    const dateTimeInput = screen.getAllByTestId('datetime1_a')[0];
    fireEvent.press(dateTimeInput);

    await timer();

    let renderOptions = AppModalService.modalOptions;

    let Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree1 = render(<Content />);

    const saveButton = subTree1.getByText('save');
    fireEvent.press(saveButton);
    await timer(300);

    renderOptions = AppModalService.modalOptions;

    Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree2 = render(<Content />);

    const okButton = subTree2.getByText('Ok');
    fireEvent.press(okButton);
    await timer(300);

    expect(ref.current.state.displayValue.toLowerCase()).toBe(
      currDateTime.toLowerCase()
    );
    expect(tree.getByText(ref.current.state.displayValue)).toBeTruthy();
  });
});
