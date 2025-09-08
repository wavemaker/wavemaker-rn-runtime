import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarPluginService, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";
import { PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';

export interface DeleteEventOutput extends Output {
  dataValue: boolean;
}

export class DeleteEventOperation implements Operation {
  constructor(private calendar: CalendarService, private permissionService: PermissionService, private calendarPluginService: CalendarPluginService) {}

  public invoke(params: CalendarInput): any {
    return this.calendar.deleteEvent({ ...params, calendarPluginService: this.calendarPluginService, permissionService: this.permissionService });
  }
}
