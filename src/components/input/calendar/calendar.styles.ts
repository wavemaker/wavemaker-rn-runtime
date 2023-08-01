import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle } from 'react-native';

export type WmCalendarStyles = BaseStyles & {
    calendar: AllStyle,
    calendarHeader: AllStyle,
    day: AllStyle,
    dayWrapper: AllStyle,
    notDayOfCurrentMonth: AllStyle,
    monthText: TextStyle,
    yearText: TextStyle,
    weekDay: AllStyle,
    today: AllStyle,
    todayText: AllStyle,
    prevMonthBtn: WmIconStyles,
    nextMonthBtn: WmIconStyles,
    prevYearBtn: WmIconStyles,
    nextYearBtn: WmIconStyles,
    selectedDay: AllStyle,
    selectedDayText: AllStyle
    eventDay1: AllStyle,
    eventDay2: AllStyle,
    eventDay3: AllStyle
};

export const DEFAULT_CLASS = 'app-calendar';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCalendarStyles = defineStyles<WmCalendarStyles>({
        root: {
            width: '100%'
        },
        text: {
            color: themeVariables.calendarDateColor
        },
        calendar : {
            backgroundColor: themeVariables.calendarBgColor,
            borderColor: themeVariables.calendarHeaderBgColor,
            borderWidth: 1,
            borderStyle: 'solid',
            marginTop: 0,
            paddingTop: 0,
            paddingBottom: 0
        },
        calendarHeader : {
            backgroundColor: themeVariables.calendarHeaderBgColor,
            borderColor: themeVariables.calendarHeaderBgColor,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            paddingTop: 8,
            paddingBottom: 8
        },
        weekDay: {
            backgroundColor: themeVariables.calendarBgColor,
            borderColor: themeVariables.calendarHeaderBgColor,
            borderBottomWidth: 1,
            borderStyle: 'solid',
            padding: 2
        },
        weekDayText: {
            color: themeVariables.calendarWeekDayTextColor,
            fontWeight: 'bold'
        },
        day: {
            borderColor: 'transparent',
            color: themeVariables.calendarDateColor
        },
        dayWrapper: {
            backgroundColor: themeVariables.calendarBgColor,
            borderColor: 'transparent',
            width: 36,
            height: 36,
            borderRadius: 36
        },
        notDayOfCurrentMonth: {
            color: themeVariables.calendarNotCurrentMonthDateColor,
            fontWeight: 'normal',
            opacity: 0
        },
        monthText: {
            fontWeight: 'bold',
            color: themeVariables.calendarHeaderTextColor
        },
        yearText: {
            fontWeight: 'bold',
            color: themeVariables.calendarHeaderTextColor
        },
        today: {
            backgroundColor: themeVariables.calendarTodayBgColor
        },
        todayText: {
            backgroundColor: themeVariables.transparent
        },
        eventDay1 : {
            color: themeVariables.calendarEventDay1Color
        },
        eventDay2 : {
            color: themeVariables.calendarEventDay2Color
        },
        eventDay3 : {
            color: themeVariables.calendarEventDay3Color
        },
        selectedDay: {
            backgroundColor: themeVariables.calendarSelectedDayBgColor
        },
        selectedDayText: {
            backgroundColor: themeVariables.calendarSelectedDayBgColor,
            color: themeVariables.calendarSelectedDayTextColor,
            fontWeight: 'bold'
        },
        prevMonthBtn: {
            root: {
                color: themeVariables.calendarPrevMonthIconColor
            }
        } as WmIconStyles,
        nextMonthBtn: {
            root: {
                color: themeVariables.calendarNextMonthIconColor
            }
        } as WmIconStyles,
        prevYearBtn: {
            root: {
                color: themeVariables.calendarPrevYearIconColor
            }
        } as WmIconStyles,
        nextYearBtn: {
            root: {
                color: themeVariables.calendarNextYearIconColor
            }
        } as WmIconStyles
    });

    addStyle(DEFAULT_CLASS, '', defaultStyles);
    addStyle(DEFAULT_CLASS + '-rtl', '', {
        prevMonthBtn: {
            root: {
                transform: [ {rotateY: '180deg'}]
            }
        } as WmIconStyles,
        nextMonthBtn: {
            root: {
                transform: [ {rotateY: '180deg'}]            
            }
        } as WmIconStyles,
        monthText: {
            padding: 2
        },
        yearText: {
            padding: 2
        }
    });
});