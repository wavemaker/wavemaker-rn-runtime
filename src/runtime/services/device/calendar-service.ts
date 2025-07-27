import * as Calendar from 'expo-calendar';
import permissionManager from '@wavemaker/app-rn-runtime/runtime/services/device/permissions';
import { CalendarInput } from '@wavemaker/app-rn-runtime/core/device/calendar-service';
import { CalendarEvent } from '@wavemaker/app-rn-runtime/variables/device/calendar/get-events.operation';
import {
  CreateEventOutput,
  getDateObj
} from '@wavemaker/app-rn-runtime/variables/device/calendar/create-event.operation';
import { DeleteEventOutput } from '@wavemaker/app-rn-runtime/variables/device/calendar/delete-event.operation';

const DEFAULT_TIME = new Date().getTime();
const DELTA_VALUE_DATE = 3 * 30 * 24 * 60 * 60 * 1000;
const DEFAULT_START_DATE = new Date(DEFAULT_TIME - DELTA_VALUE_DATE);
const DEFAULT_END_DATE = new Date(DEFAULT_TIME + DELTA_VALUE_DATE);

export class CalendarService {

  constructor() {}

  public getEvents(params: CalendarInput): Promise<Array<CalendarEvent>> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('calendar').then(() => {
          return Calendar.getCalendarsAsync().then(result => {
            let calendarIds: Array<string> = [];
            result.forEach(c => calendarIds.push(c.id));
            Calendar.getEventsAsync(calendarIds, params.eventStart || DEFAULT_START_DATE, params.eventEnd || DEFAULT_END_DATE)
              .then(res => {
                let filteredResult = res;
                if (params.eventTitle || params.eventLocation || params.eventNotes) {
                  filteredResult = res.filter(event => event.title === params.eventTitle || event.location === params.eventLocation || event.notes === params.eventNotes);
                }
                let events: Array<CalendarEvent> = [];
                filteredResult.forEach(e => {
                  events.push({
                    title: e.title,
                    message: e.notes,
                    location: e.location || '',
                    startDate: e.startDate,
                    endDate: e.endDate
                  })
                });
                return resolve(events);
              })
          })
      }, reject);
    });
  }


  public createEvent(params: CalendarInput): Promise<CreateEventOutput> {
    const eventMetadata = {
      title: params.eventTitle,
      location: params.eventLocation,
      notes: params.eventNotes,
      startDate: getDateObj(params.eventStart) || DEFAULT_START_DATE,
      endDate: getDateObj(params.eventEnd) || DEFAULT_END_DATE
    };

    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('calendar').then(() => {
          return Calendar.getCalendarsAsync().then(result => {
            let calendarIds: Array<string> = [];
            result.forEach(c => {
              if (c.allowsModifications) {
                calendarIds.push(c.id);
              }
            });
            // createEventAsync has calendarId as required parameter. Need to expose ownerAccount as filter field in studio. Right now passing calendar index as zero.
            return Calendar.createEventAsync(calendarIds[0], eventMetadata).then(res => {
              const event = {
                dataValue: res
              };
              return resolve(event);
            })
          }, reject);
      });
    });
  }


  public deleteEvent(params: CalendarInput): Promise<DeleteEventOutput> {

    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('calendar').then(() => {
          return Calendar.getCalendarsAsync().then(result => {
            let calendarIds: Array<string> = [];
            result.forEach(c => {
              if (c.allowsModifications) {
                calendarIds.push(c.id);
              }
            });
            Calendar.getEventsAsync(calendarIds, params.eventStart || DEFAULT_START_DATE, params.eventEnd || DEFAULT_END_DATE)
              .then((res) => {
                const filteredResult = res.filter(event => event.title === params.eventTitle || event.location === params.eventLocation
                  || event.notes === params.eventNotes);
                Promise.all(
                  filteredResult.map((event) => { Calendar.deleteEventAsync(event.id)}))
                  .then(res => {
                    const event = {
                      dataValue: true
                    }
                    return resolve(event);
                  })
              })
          }, reject);
      });
    });
  }
}
