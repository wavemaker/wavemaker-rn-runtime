import React from 'react';
import { PermissionConsumer, PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';
import { Operation, Output } from '../operation.provider';
import { CalendarInput, CalendarPluginConsumer, CalendarPluginService, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";

export interface CalendarEvent extends Output {
  title: string;
  message: string;
  location: string;
  startDate: string | Date;
  endDate: string | Date;
}

export class GetEventsOperation implements Operation {
  constructor(private calendar: CalendarService) {}

  public invoke(params: CalendarInput): any {
    return (
      <PermissionConsumer>
        {(permissionService: PermissionService) => {
          return (
            <CalendarPluginConsumer>
              {(calendarPluginService: CalendarPluginService) => {
                return this.calendar.getEvents({ ...params, calendarPluginService, permissionService });
              }}
            </CalendarPluginConsumer>
          );
        }}
      </PermissionConsumer>
    );
  }
}

