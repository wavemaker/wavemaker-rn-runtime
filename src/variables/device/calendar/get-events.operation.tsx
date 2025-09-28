import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarPluginService, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";
import { PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';

export interface CalendarEvent extends Output {
  title: string;
  message: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
}

export class GetEventsOperation implements Operation {
  constructor(private calendar: CalendarService, private permissionService: PermissionService, private calendarPluginService: CalendarPluginService) {}

  public invoke(params: CalendarInput): any {
    return this.calendar.getEvents({ ...params, calendarPluginService: this.calendarPluginService, permissionService: this.permissionService });
  }
}

