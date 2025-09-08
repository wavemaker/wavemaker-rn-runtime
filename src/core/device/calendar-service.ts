import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import React from 'react';

export interface CalendarInput extends Input {
  eventTitle: string;
  eventLocation: string;
  eventNotes: string;
  eventStart: Date;
  eventEnd: Date;
  calendarPluginService: any;
  permissionService: any;
}

export interface CalendarService {
  getEvents: (params: CalendarInput) => any;
  createEvent: (params: CalendarInput) => any;
  deleteEvent: (params: CalendarInput) => any;
}

// * expo-calendar plugin
export interface CalendarPluginService {
  getCalendarsAsync: any;
  getEventsAsync: any;
  createEventAsync: any;
  deleteEventAsync: any;
}
const CalendarPluginContext = React.createContext<CalendarPluginService>(null as any);

export const CalendarPluginProvider = CalendarPluginContext.Provider;
export const CalendarPluginConsumer = CalendarPluginContext.Consumer;
