import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';

export interface CalendarInput extends Input {
  eventTitle: string;
  eventLocation: string;
  eventNotes: string;
  eventStart: Date;
  eventEnd: Date;
}

export interface CalendarService {
  getEvents: (params: CalendarInput) => any;
  createEvent: (params: CalendarInput) => any;
  deleteEvent: (params: CalendarInput) => any;
}
