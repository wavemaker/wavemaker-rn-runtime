import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { TextStyle } from 'react-native';

export type WmCalendarStyles = BaseStyles & {
    calendar: AllStyle,
    calendarHeader: AllStyle,
    day: AllStyle,
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
export const DEFAULT_STYLES: WmCalendarStyles = {
    root: {
        width: '100%'
    },
    text: {
        color: ThemeVariables.calendarDateColor
    },
    calendar : {
        backgroundColor: ThemeVariables.calendarBgColor,
        borderColor: ThemeVariables.calendarHeaderBgColor,
        borderWidth: 1,
        borderStyle: 'solid',
        marginTop: 0,
        paddingTop: 0,
        paddingBottom: 0
    },
    calendarHeader : {
        backgroundColor: ThemeVariables.calendarHeaderBgColor,
        borderColor: ThemeVariables.calendarHeaderBgColor,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingTop: 8,
        paddingBottom: 8
    },
    weekDay: {
        backgroundColor: ThemeVariables.calendarBgColor,
        borderColor: ThemeVariables.calendarHeaderBgColor,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        padding: 4
    },
    weekDayText: {
        color: ThemeVariables.calendarWeekDayTextColor,
        fontWeight: 'bold'
    },
    day: {
        backgroundColor: ThemeVariables.calendarBgColor,
        borderColor: 'transparent',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderRadius: 4,
        color: ThemeVariables.calendarDateColor
    },
    notDayOfCurrentMonth: {
        color: ThemeVariables.calendarNotCurrentMonthDateColor,
        fontWeight: 'normal'
    },
    monthText: {
        fontWeight: 'bold',
        color: ThemeVariables.calendarHeaderTextColor
    },
    yearText: {
        fontWeight: 'bold',
        color: ThemeVariables.calendarHeaderTextColor
    },
    today: {
        backgroundColor: ThemeVariables.calendarTodayBgColor,
    },
    todayText: {},
    eventDay1 : {
        color: ThemeVariables.calendarEventDay1Color
    },
    eventDay2 : {
        color: ThemeVariables.calendarEventDay2Color
    },
    eventDay3 : {
        color: ThemeVariables.calendarEventDay3Color
    },
    selectedDay: {
        backgroundColor: ThemeVariables.calendarSelectedDayBgColor
    },
    selectedDayText: {
        color: ThemeVariables.calendarSelectedDayTextColor,
        fontWeight: 'bold'
    },
    prevMonthBtn: {
        root: {
            color: ThemeVariables.calendarPrevMonthIconColor
        }
    } as WmIconStyles,
    nextMonthBtn: {
        root: {
            color: ThemeVariables.calendarNextMonthIconColor
        }
    } as WmIconStyles,
    prevYearBtn: {
        root: {
            color: ThemeVariables.calendarPrevYearIconColor
        }
    } as WmIconStyles,
    nextYearBtn: {
        root: {
            color: ThemeVariables.calendarNextYearIconColor
        }
    } as WmIconStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);