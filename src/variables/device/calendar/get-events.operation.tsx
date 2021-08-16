import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";

export interface CalendarEvent extends Output {
  title: string;
  message: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
}

export class GetEventsOperation implements Operation {
  constructor(private calendar: CalendarService) {}

  public invoke(params: CalendarInput): Promise<Array<CalendarEvent>> {
    return this.calendar.getEvents(params);
  }
}

