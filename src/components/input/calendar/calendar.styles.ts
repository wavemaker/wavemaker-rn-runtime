import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
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
export const DEFAULT_STYLES: WmCalendarStyles = defineStyles<WmCalendarStyles>({
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
        padding: 2
    },
    weekDayText: {
        color: ThemeVariables.calendarWeekDayTextColor,
        fontWeight: 'bold'
    },
    day: {
        borderColor: 'transparent',
        color: ThemeVariables.calendarDateColor
    },
    dayWrapper: {
        backgroundColor: ThemeVariables.calendarBgColor,
        borderColor: 'transparent',
        width: 36,
        height: 36,
        borderRadius: 36
    },
    notDayOfCurrentMonth: {
        color: ThemeVariables.calendarNotCurrentMonthDateColor,
        fontWeight: 'normal',
        opacity: 0
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
        backgroundColor: ThemeVariables.calendarTodayBgColor
    },
    todayText: {
        backgroundColor: ThemeVariables.calendarTodayBgColor
    },
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
        backgroundColor: ThemeVariables.calendarSelectedDayBgColor,
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
});

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);