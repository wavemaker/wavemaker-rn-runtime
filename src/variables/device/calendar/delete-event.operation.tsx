import React from 'react';
import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarPluginConsumer, CalendarPluginService, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";
import { PermissionConsumer, PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';

export interface DeleteEventOutput extends Output {
  dataValue: boolean;
}

export class DeleteEventOperation implements Operation {
  constructor(private calendar: CalendarService) {}

  public invoke(params: CalendarInput): any {
    return (
      <PermissionConsumer>
        {(permissionService: PermissionService) => {
          return (
            <CalendarPluginConsumer>
              {(calendarPluginService: CalendarPluginService) => {
                return this.calendar.deleteEvent({ ...params, calendarPluginService, permissionService });
              }}
            </CalendarPluginConsumer>
          );
        }}
      </PermissionConsumer>
    );
  }
}
