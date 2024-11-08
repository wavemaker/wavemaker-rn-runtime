import React, { createRef, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import WmCalendar from '@wavemaker/app-rn-runtime/components/input/calendar/calendar.component';
import WmCalendarProps from '@wavemaker/app-rn-runtime/components/input/calendar/calendar.props';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react-native';
import moment, { Moment } from 'moment';
import { exitProcess } from 'yargs';

const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

const timer = (time = 100) =>
  new Promise((resolve: any, reject) => {
    setTimeout(() => resolve(), time);
  });

describe('WmCalendar Component', () => {
  let props: WmCalendarProps;
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const date1 = '15-' + month + '-' + year;
  const date2 = '18-' + month + '-' + year;
  const date3 = '20-' + month + '-' + year;

  beforeEach(() => {
    props = new WmCalendarProps();
    props.name = 'test_calendar';
    props.eventstart = 'date';
    props.dataset = [
      { date: date1, event: 'Event A' },
      { date: date2, event: 'Event B' },
      { date: date3, event: 'Event C' },
      { date: date3, event: 'Event D' },
    ];
    props.eventtitle = 'event';
  });

  it('should render without crashing', () => {
    const { getByText } = render(<WmCalendar {...props} />);
    expect(getByText('chevron-right')).toBeTruthy();
    expect(getByText('chevron-left')).toBeTruthy();
    expect(getByText(new Date().getUTCFullYear().toString())).toBeTruthy();
    expect(getByText(new Date().toDateString().substring(4, 7))).toBeTruthy();
    expect(screen).toMatchSnapshot();
  });

  it('should initialize with the current date', () => {
    const component = new WmCalendar(props);
    const today = moment();
    expect(component.state.selectedDate.format('DD-MM-YYYY')).toEqual(
      today.format('DD-MM-YYYY')
    );
  });

  it('should prepare dataset correctly', () => {
    const component = new WmCalendar(props);
    component.prepareDataset(props.dataset);
    expect(component.state.calendar.get(date1)).toBeDefined();
    expect(component.state.calendar.get(date2).events.length).toBe(1);
  });

  it('should handle date change and invoke onSelect callback', async () => {
    const onSelectMock = jest.fn();
    const ref = createRef();
    const { getByText } = render(
      <WmCalendar {...props} onSelect={onSelectMock} ref={ref} />
    );

    // Choosing a new date (assuming the date exists for simplicity)
    const dateButton = getByText('15');
    fireEvent.press(dateButton);

    expect(onSelectMock).toHaveBeenCalled();
    await waitFor(() => {
      expect(ref.current.state.props.datavalue).toBe(date1);
    });
    expect(dateButton.props.style[4].backgroundColor).toBe(
      ref.current.styles.selectedDay.backgroundColor
    );
  });

  xit('should render event icon on days with events', async () => {
    const ref = createRef();
    const { getByTestId, getAllByText } = render(
      <WmCalendar {...props} ref={ref} />
    );

    ref.current.proxy.dataset = [
      { date: date1, event: 'Event A' },
      { date: date2, event: 'Event B' },
      { date: date3, event: 'Event C' },
      { date: date3, event: 'Event D' },
    ];
    await timer(300);

    const eventIcon1 = getAllByText('circle');
    expect(eventIcon1.length).toBe(4);
  });

  it('should update styles for selected date correctly', async () => {
    const ref = createRef();
    const { getByText, rerender } = render(<WmCalendar {...props} ref={ref} />);

    // Update prop to change the date
    ref.current.state.props.datavalue = date2;
    await timer();

    const selectedDate = getByText(moment(date2, 'DD-MM-YYYY').format('DD'));
    expect(selectedDate.props.style[4].backgroundColor).toBe(
      ref.current.styles.selectedDay.backgroundColor
    );
  });

  it('should navigate to previous and next month correctly', async () => {
    const { getByTestId, getByText } = render(<WmCalendar {...props} />);

    // Test previous month button
    const prevMonthBtn = getByTestId('test_calendar_prevmonthicon_icon');
    fireEvent.press(prevMonthBtn);
    await timer();
    const prevMonth = moment()
      .month(month - 2)
      .format('MMM');
    expect(getByText(prevMonth.toString())).toBeTruthy();

    // Test next month button
    const nextMonthBtn = getByTestId('test_calendar_nextmonthicon_icon');
    fireEvent.press(nextMonthBtn);
    await timer();
    expect(
      getByText(
        moment()
          .month(month - 1)
          .format('MMM')
          .toString()
      )
    ).toBeTruthy();
  });

  it('should invoke onBeforerender and onViewrender event callbacks', async () => {
    const onBeforerenderMock = jest.fn();
    const ref = createRef();
    const onViewrenderMock = jest.fn();
    props.onBeforerender = onBeforerenderMock;
    props.onViewrender = onViewrenderMock;

    render(<WmCalendar {...props} ref={ref} />);

    await timer(300);
    expect(onBeforerenderMock).toHaveBeenCalled();
    ref.current.proxy.name = 'test_calendar';
    await timer(300);

    expect(onViewrenderMock).toHaveBeenCalled();
    // });
  });

  xit('should apply custom styles correctly', () => {
    props.styles = {
      root: { backgroundColor: 'blue' },
      day: { color: 'red' },
    };
    const { getByText } = render(<WmCalendar {...props} />);
    const dayLabel = getByText('15'); // Sample day with event
    expect(dayLabel.props.style).toEqual(
      expect.arrayContaining([{ color: 'red' }])
    );
  });

  it('should render multiple events correctly on a single date', () => {
    const component = new WmCalendar(props);
    component.prepareDataset(props.dataset);
    const dateWindow = component.state.calendar.get(date3);
    expect(dateWindow.events.length).toBe(2); // Two events on the same day
  });

  it('should handle invalid dates/events gracefully', () => {
    props.dataset.push({ date: 'invalid-date', event: 'Invalid Event' });
    const component = new WmCalendar(props);
    expect(() => component.prepareDataset(props.dataset)).not.toThrow();
  });

  it('should restore state correctly on re-render with new props', () => {
    const { getByText, rerender } = render(<WmCalendar {...props} />);
    const currMonth = moment()
      .month(month - 1)
      .format('MMM');
    const currYear = moment().format('YYYY');

    expect(getByText(currMonth)).toBeTruthy();
    expect(getByText(currYear)).toBeTruthy();

    rerender(<WmCalendar {...props} dataset={[]} />); // Change props

    expect(getByText(currMonth)).toBeTruthy();
    expect(getByText(currYear)).toBeTruthy();
  });

  // show property
  it('handles show property correctly', async () => {
    const ref = createRef();
    const tree = render(<WmCalendar {...props} show={true} ref={ref} />);

    await timer(100);
    expect(tree.root.props.style.width).not.toBe(0);
    expect(tree.root.props.style.height).not.toBe(0);

    ref.current.proxy.show = false;
    await timer(100);

    expect(tree.root.props.style.width).toBe(0);
    expect(tree.root.props.style.height).toBe(0);
  });

  //skeleton loader
  it('should render skeleton with respect to showskeletonwidth and showskeletonheight when show skeleton is true', () => {
    const renderSkeletonMock = jest.spyOn(WmCalendar.prototype, 'renderSkeleton');
    const tree = render(<WmCalendar {...props} showskeleton={true} skeletonwidth='100' skeletonheight='50' />);
    expect(renderSkeletonMock).toHaveBeenCalledTimes(1);
    const viewEles = tree.UNSAFE_getAllByType(View); 
    expect(tree).toMatchSnapshot();
    expect(viewEles[2].props.style.width).toBe('100');
    expect(viewEles[2].props.style.height).toBe('50');
    expect(viewEles[3].props.style.width).toBe('100');
    expect(viewEles[3].props.style.height).toBe('50');
    expect(viewEles[4].props.style.width).toBe('100');
    expect(viewEles[4].props.style.height).toBe('50');
  })

  it('should render skeleton with respect to root styles when show skeleton is true', () => {
    const tree = render(<WmCalendar {...props} name="date1" showskeleton={true}/>);
    const viewEles = tree.UNSAFE_getAllByType(View);
    expect(viewEles[2].props.style.width).toBe('10%');
    expect(viewEles[2].props.style.height).toBe(28);
    expect(viewEles[3].props.style.width).toBe('68%');
    expect(viewEles[3].props.style.height).toBe(16);
    expect(viewEles[4].props.style.width).toBe('10%');
    expect(viewEles[4].props.style.height).toBe(28);
  })
});
