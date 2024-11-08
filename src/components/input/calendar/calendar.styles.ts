import BASE_THEME, { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseStyles, defineStyles } from '@wavemaker/app-rn-runtime/core/base.component';
import { WmIconStyles } from '@wavemaker/app-rn-runtime/components/basic/icon/icon.styles';
import { TextStyle } from 'react-native';
import { WmSkeletonStyles } from '@wavemaker/app-rn-runtime/components/basic/skeleton/skeleton.styles';

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
    eventDay3: AllStyle,
    skeleton: WmSkeletonStyles;
};

export const DEFAULT_CLASS = 'app-calendar';
BASE_THEME.registerStyle((themeVariables, addStyle) => {
    const defaultStyles: WmCalendarStyles = defineStyles<WmCalendarStyles>({
        root: {
            width: '100%',
            minHeight: 456,
            minWidth: 360
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
            paddingBottom: 0,
            elevation: 6
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
            padding: 2,
        },
        weekDayText: {
            color: themeVariables.calendarWeekDayTextColor,
            fontWeight: '400',
            fontFamily: themeVariables.baseFont,
            fontSize: 16,
        },
        day: {
            borderColor: 'transparent',
            color: themeVariables.calendarDateColor,
            fontSize: 16,
            fontFamily: themeVariables.baseFont,
            fontWeight: '400'
        },
        dayWrapper: {
            backgroundColor: themeVariables.calendarBgColor,
            borderColor: 'transparent',
            width: 38,
            height: 38,
            borderRadius: 26
        },
        notDayOfCurrentMonth: {
            color: themeVariables.calendarNotCurrentMonthDateColor,
            fontWeight: 'normal',
            opacity: 0
        },
        monthText: {
            fontWeight: '500',
            fontFamily: themeVariables.baseFont,
            color: themeVariables.calendarHeaderTextColor
        },
        yearText: {
            fontWeight: '500',
            fontFamily: themeVariables.baseFont,
            color: themeVariables.calendarHeaderTextColor
        },
        today: {
            backgroundColor: themeVariables.calendarBgColor,
            borderColor: themeVariables.primaryColor
        },
        todayText: {
            backgroundColor: themeVariables.calendarSelectedDayBgColor
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
        } as WmIconStyles,
        skeleton: {
            root: {
              borderRadius:4,
              display:'flex',
              flexDirection:'column',
              margin:8,
            }
          } as WmSkeletonStyles,
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