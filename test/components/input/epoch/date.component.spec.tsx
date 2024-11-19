import React, { ReactNode, createRef } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import WmDate from '@wavemaker/app-rn-runtime/components/input/epoch/date/date.component';
import WmWheelScrollPicker from '@wavemaker/app-rn-runtime/components/input/epoch/wheelpicker/wheelpicker.component';
import WmDateProps from '@wavemaker/app-rn-runtime/components/input/epoch/date/date.props';
import { ScrollView } from 'react-native-gesture-handler';
import AppModalService from '@wavemaker/app-rn-runtime/runtime/services/app-modal.service';
import { AssetProvider } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { ModalProvider } from '@wavemaker/app-rn-runtime/core/modal.service';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from '@testing-library/react-native';

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
  AppModalService.modalsOpened = [];

  return render(
    <SafeAreaProvider>
      <ModalProvider value={AppModalService}>
        {/* <AssetProvider value={loadAsset}> */}
        <WmDate {...props} />
        {/* </AssetProvider> */}
      </ModalProvider>
    </SafeAreaProvider>
  );
}

describe('WmDate Component', () => {
  let props;

  const currDate = new Date()
    .toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');

  beforeEach(() => {
    props = new WmDateProps();
  });

  it('should render with default properties correctly', async () => {
    const ref = createRef();
    render(<WmDate {...props} name="date1" ref={ref} />);
    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer(200);

    expect(screen.getByText(props.placeholder)).toBeTruthy();
    expect(ref.current.state.showDatePicker).toBe(true);
    expect(ref.current.state.showDatePickerModal).toBe(true);
    expect(screen).toMatchSnapshot();
  });

  it('should apply the correct style class name when floatinglabel is present', () => {
    props.floatinglabel = 'Test Label';
    const ref = createRef();
    render(<WmDate {...props} name="date1" ref={ref} />);
    const className = ref.current.getStyleClassName();
    expect(className).toContain('app-date-with-label');
  });

  it('should show date picker modal on focus', async () => {
    const ref = createRef();
    const onTapMock = jest.fn();
    render(<WmDate {...props} name="date1" ref={ref} onTap={onTapMock} />);

    const dateInput = screen.getAllByTestId('date1_a')[0];

    fireEvent.press(dateInput);
    await timer(300);
    const selectDateText = screen.getByText('Select Date');
    expect(selectDateText).toBeTruthy();
    expect(screen.getByText('Select')).toBeTruthy();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(onTapMock).toHaveBeenCalled();
  });

  it('should handle date change correctly', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmDate
        {...props}
        name="date1"
        ref={ref}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        datepattern="yyyy-MM-dd"
      />
    );

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer(300);

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

    expect(ref.current.state.props.datavalue).toBe('1990-05-05');
    expect(ref.current.state.dateValue.toISOString()).toBe(
      '1990-05-04T18:30:00.000Z'
    );
    expect(ref.current.state.displayValue).toBe('1990-05-05');
    expect(onChangeMock).toHaveBeenCalled();
    expect(onBlurMock).toHaveBeenCalled();
    expect(screen.getByText('1990-05-05')).toBeTruthy();
  });

  it('should handle invalid date input correctly', async () => {
    const ref = createRef();
    const onChangeMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmDate
        {...props}
        name="date1"
        ref={ref}
        onChange={onChangeMock}
        onBlur={onBlurMock}
        datepattern="yyyy-MM-dd"
        mindate="2024-08-01"
        maxdate="2024-08-31"
      />
    );

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer(300);

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

    expect(ref.current.state.props.datavalue).toBe('Invalid date');
  });

  it('should call onFocus and onBlur correctly', async () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();

    render(
      <WmDate
        {...props}
        name="date1"
        onFocus={onFocusMock}
        onBlur={onBlurMock}
      />
    );
    const dateInput = screen.getAllByTestId('date1_a')[0];

    fireEvent.press(dateInput);
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

    render(<WmDate {...props} name="date1" ref={ref} />);

    await timer(300);

    expect(ref.current.state.dateValue).toBeTruthy();
    expect(ref.current.state.displayValue).toBe(currDate);
    expect(screen.getByText(currDate)).toBeTruthy();
  });

  it('should handle minimum date property correctly', () => {
    const minDate = new Date(2022, 7, 10).toISOString();
    const ref = createRef();
    const currDate = new Date().toISOString().split('T')[0];

    render(<WmDate {...props} name="date1" mindate={minDate} ref={ref} />);

    expect(ref.current.state.props.mindate.toISOString()).toEqual(minDate);

    render(<WmDate {...props} name="date1" mindate="CURRENT_DATE" ref={ref} />);

    expect(ref.current.state.props.mindate.toISOString().split('T')[0]).toEqual(
      currDate
    );
  });

  it('should handle maximum date property correctly', () => {
    const maxDate = new Date(2024, 7, 10).toISOString();
    const ref = createRef();
    const currDate = new Date().toISOString().split('T')[0];

    render(<WmDate {...props} name="date1" maxdate={maxDate} ref={ref} />);

    expect(ref.current.state.props.maxdate.toISOString()).toEqual(maxDate);

    render(<WmDate {...props} name="date1" maxdate="CURRENT_DATE" ref={ref} />);

    expect(ref.current.state.props.maxdate.toISOString().split('T')[0]).toEqual(
      currDate
    );
  });

  it('should render FloatingLabel if the floatinglabel prop is set', () => {
    props.floatinglabel = 'Test Label';

    const { getByText } = render(<WmDate {...props} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should clear value on pressing clear button and check validation', async () => {
    const validateFnMock = jest.spyOn(WmDate.prototype, 'validate');
    const ref = createRef();

    render(
      <WmDate
        {...props}
        name="date1"
        datavalue="CURRENT_DATE"
        required={true}
        ref={ref}
        datepattern="yyyy-MM-dd"
      />
    );

    await timer();

    expect(screen.getByText(currDate)).toBeTruthy();
    expect(screen.getByText('clear')).toBeTruthy();

    const clearButton = screen.getByText('clear');

    fireEvent.press(clearButton);
    await timer(300);

    expect(ref.current.state.props.datavalue).toBe(null);
    expect(screen.queryByText('clear')).toBeNull();

    expect(validateFnMock).toHaveBeenCalled();
  });

  it('should handle readonly correctly', async () => {
    const ref = createRef();
    const onTapMock = jest.fn();
    const onFocusMock = jest.fn();

    render(
      <WmDate
        {...props}
        name="date1"
        datavalue="CURRENT_DATE"
        readonly={true}
        ref={ref}
        datepattern="yyyy-MM-dd"
        onTap={onTapMock}
        onFocus={onFocusMock}
      />
    );

    await timer();

    expect(screen.getByText(currDate)).toBeTruthy();
    expect(screen.queryByText('clear')).toBeNull();

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent(dateInput, 'press');

    await timer(300);

    expect(onFocusMock).not.toHaveBeenCalled();
    expect(onTapMock).toHaveBeenCalled();
  });

  xit('should handle accessibility props', async () => {
    render(
      <WmDate
        {...props}
        name="date1"
        datavalue="CURRENT_DATE"
        datepattern="yyyy-MM-dd"
        hint="date1_Allyhint"
        accessibilityrole="date1_Allyrole"
        accessibilitylabel="date1_Allylabel"
      />
    );

    await timer(300);

    await waitFor(() => {
      expect(screen.getByRole('date1_Allyrole')).toBeTruthy();
      expect(screen.getByLabelText('date1_Allylabel')).toBeTruthy();
      expect(screen.getByA11yHint('date1_Allyhint')).toBeTruthy();
    });
  });

  it('should handle layout change', async () => {
    render(
      <WmDate
        {...props}
        name="date1"
        datavalue="2024-08-14"
        datepattern="yyyy-MM-dd"
      />
    );

    const initialScrollToMock = jest.spyOn(
      WmWheelScrollPicker.prototype,
      'initialScrollTo'
    );

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer(300);

    const scrollViewDate = screen.UNSAFE_getAllByType(ScrollView)[0];

    fireEvent(scrollViewDate, 'layout');

    expect(initialScrollToMock).toHaveBeenCalled();
  });

  it('should set showDatePickerModal to false when modal is dismissed', async () => {
    const ref = createRef();
    render(<WmDate {...props} name="date1" ref={ref} />);
    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer(200);
    expect(ref.current.state.showDatePickerModal).toBe(true);

    const modalEle = screen.UNSAFE_getByType(Modal);
    fireEvent(modalEle, 'dismiss');
    await timer(200);

    expect(ref.current.state.showDatePickerModal).toBe(false);
  });

  //iswheelpicker = false cases (prop not available in studio currently)

  it('should render date widget when wheel picker is false and platform is android', async () => {
    Platform.OS = 'android';

    render(
      <WmDate
        {...props}
        name="date1"
        iswheelpicker={false}
        datavalue="2024-08-14"
        datepattern="yyyy-MM-dd"
      />
    );
    const dateInput = screen.getAllByTestId('date1_a')[0];

    fireEvent.press(dateInput);
    await timer(300);

    expect(screen).toMatchSnapshot();
  });

  it('should render date widget when wheel picker is false and platform is ios', async () => {
    Platform.OS = 'ios';

    render(
      <ModalProvider value={AppModalService}>
        <AssetProvider value={loadAsset}>
          <WmDate
            {...props}
            name="date1"
            iswheelpicker={false}
            datavalue="2024-08-14"
            datepattern="yyyy-MM-dd"
          />
        </AssetProvider>
      </ModalProvider>
    );

    const dateInput = screen.getAllByTestId('date1_a')[0];

    fireEvent.press(dateInput);
    await timer(300);

    expect(screen).toMatchSnapshot();

    const renderOptions = AppModalService.modalOptions;
    const Content = () => {
      return <>{renderOptions.content}</>;
    };
    const subTree = render(<Content />);

    expect(subTree).toMatchSnapshot();
  });

  //// web cases

  it('should render datepicker when Platform.OS = "web"', async () => {
    Platform.OS = 'web';

    let userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';

    window['navigator'] = { userAgent: userAgent };

    const ref = createRef();

    const tree = renderComponentWithWrappers({
      ...props,
      ref,
      name: 'date1',
      datepattern: 'yyyy-MM-dd',
      locale: 'en',
    });
    await timer(200);

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer();

    const renderOptions = AppModalService.modalOptions;

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree = render(<Content />);

    AppModalService.animatedRefs = [
      {
        triggerExit: () => {},
      },
    ];

    const saveButton = subTree.getByText('save');
    fireEvent.press(saveButton);
    await timer(300);

    expect(ref.current.state.displayValue).toBe(currDate);
    expect(tree.getByText(currDate)).toBeTruthy();
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
      name: 'date1',
      datepattern: 'yyyy-MM-dd',
      locale: 'en',
      onBlur: onBlurMock,
      triggerValidation: triggerValidationMock,
    });
    await timer(200);

    const dateInput = screen.getAllByTestId('date1_a')[0];
    fireEvent.press(dateInput);

    await timer();

    const renderOptions = AppModalService.modalOptions;

    const Content = () => {
      return <>{renderOptions.content}</>;
    };

    let subTree = render(<Content />);

    AppModalService.animatedRefs = [
      {
        triggerExit: () => {},
      },
    ];

    const cancelButton = subTree.getByLabelText('close');
    fireEvent.press(cancelButton);
    await timer(300);

    expect(onBlurMock).toHaveBeenCalled();
    expect(triggerValidationMock).toHaveBeenCalled();
  });

   //skeleton loader
  it('should render skeleton with respect to root styles when show skeleton is true', () => {
    const tree = render(<WmDate {...props} name="date1" showskeleton={true}/>);
    const viewEles = tree.UNSAFE_getAllByType(View);
    expect(viewEles[1].props.style.width).toBe('80%');
    expect(viewEles[1].props.style.height).toBe(16);
    expect(viewEles[2].props.style.width).toBe(32);
    expect(viewEles[2].props.style.height).toBe(32);
  })

});
