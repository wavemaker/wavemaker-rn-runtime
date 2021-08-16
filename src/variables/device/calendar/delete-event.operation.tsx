import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";

export interface DeleteEventOutput extends Output {
  dataValue: boolean;
}

export class DeleteEventOperation implements Operation {
  constructor(private calendar: CalendarService) {}

  public invoke(params: CalendarInput): Promise<DeleteEventOutput> {
    return this.calendar.deleteEvent(params);
  }
}
