import { Operation, Output } from '../operation.provider';
import { isDate, isString } from 'lodash';
import moment from 'moment';
import { CalendarInput, CalendarPluginService, CalendarService } from "@wavemaker/app-rn-runtime/core/device/calendar-service";
import { PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';

export interface CreateEventOutput extends Output {
  dataValue: string;
}

/**
 * method to get the date object from the input received
 */
export const getDateObj = (value: any): any => {

  /*if the value is a date object, no need to covert it*/
  if (isDate(value)) {
    return value;
  }

  /*if the value is a timestamp string, convert it to a number*/
  if (!isNaN(value)) {
    value = parseInt(value, 10);
  }

  if (!moment(value).isValid() || value === '' || value === null || value === undefined) {
    return undefined;
  }
  let dateObj = new Date(value);
  /**
   * if date value is string "20-05-2019" then new Date(value) return 20May2019 with current time in India,
   * whereas this will return 19May2019 with time lagging for few hours.
   * This is because it returns UTC time i.e. Coordinated Universal Time (UTC).
   * To create date in local time use moment
   */
  if (isString(value)) {
    /*
     * If selected locale is Arabic, moment(value).format() is giving date in Arabic language
     * (Ex: If date value is "1990-11-23" and moment(value).format() is "١٩٩٠-١١-٢٣T٠٠:٠٠:٠٠+٠٥:٣٠")
     * and new Date(moment(value).format()) is giving Invalid Date. So frst converting it to timestamp value.
    */
    dateObj = new Date(moment(moment(value).format()).valueOf());
  }

  if (isNaN(dateObj.getDay())) {
    return new Date();
  }
  return dateObj;
};

export class CreateEventOperation implements Operation {
  constructor(private calendar: CalendarService, private permissionService: PermissionService, private calendarPluginService: CalendarPluginService) {}

  public invoke(params: CalendarInput): any {
    return this.calendar.createEvent({ ...params, calendarPluginService: this.calendarPluginService, permissionService: this.permissionService });
  }
}
