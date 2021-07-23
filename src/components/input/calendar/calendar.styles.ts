import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';

export type WmCalendarStyles = BaseStyles & {
    today: AllStyle,
    title: AllStyle,
    prevBtn: WmIconStyles,
    nextBtn: WmIconStyles,
    week: AllStyle,
    selectedDay: AllStyle,
    selectedDayText: AllStyle,
    todayCover: AllStyle,
    eventDay1: {borderColor: string},
    eventDay2: {borderColor: string},
    eventDay3: {borderColor: string}
};

export const DEFAULT_CLASS = 'app-calendar';
export const DEFAULT_STYLES: WmCalendarStyles = {
    root: {
        width: '100%'
    },
    text: {
        color: ThemeVariables.calendarDateColor
    },
    title: {
        fontWeight: 'bold',
        color: ThemeVariables.calendarMonthTitleColor
    },
    week: {
        fontWeight: 'bold'
    },
    todayCover: {
        backgroundColor: ThemeVariables.calendarTodayBgColor
    },
    today: {},
    eventDay1 : {
        borderColor: ThemeVariables.calendarEventDay1Color
    },
    eventDay2 : {
        borderColor: ThemeVariables.calendarEventDay2Color
    },
    eventDay3 : {
        borderColor: ThemeVariables.calendarEventDay3Color
    },
    selectedDay: {
        backgroundColor: ThemeVariables.calendarSelectedDayBgColor
    },
    selectedDayText: {
        color: ThemeVariables.calendarSelectedDayTextColor,
        fontWeight: 'bold'
    },
    prevBtn: {
        root: {
            color: ThemeVariables.calendarPrevIconColor
        }
    } as WmIconStyles,
    nextBtn: {
        root: {
            color: ThemeVariables.calendarNextIconColor
        }
    } as WmIconStyles
};

BASE_THEME.addStyle(DEFAULT_CLASS, '', DEFAULT_STYLES);