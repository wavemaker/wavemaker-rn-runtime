import * as Location from "expo-location";
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';
import { Camera } from "expo-camera";
import { Platform } from "react-native";

const rejectionMsgMap = new Map<string, string>();

rejectionMsgMap.set('camera', 'camera permission is required to capture image');
rejectionMsgMap.set('video', 'camera and audio permissions are required to capture video');
rejectionMsgMap.set('location', 'enable geolocation permission to access the location');
rejectionMsgMap.set('contacts', 'enable contacts permission to access the contacts');
rejectionMsgMap.set('calendar', 'enable calendar permission to access the calendar events');

interface objectMap {
  [key: string]: Array<string>
}

export default {
  requestPermissions: (type: string) => {
    let query;
    if (type === 'location') {
      // requestPermissionsAsync is deprecated and requestForegroundPermissionsAsync is available only in sdk 41+
      query = Location.requestPermissionsAsync();
    } else if (type === 'image' || type === 'camera' || type === 'video') {
      query = Camera.requestPermissionsAsync();
    } else if(type === 'contacts') {
      query = Contacts.requestPermissionsAsync();
    } else if(type === 'calendar') {
      if (Platform.OS === 'ios') {
        query = Promise.all([Calendar.requestCalendarPermissionsAsync(), Calendar.requestRemindersPermissionsAsync()]);
      }  else {
        query = Calendar.requestCalendarPermissionsAsync();
      }
    }
    if (!query) {
      return Promise.reject('no supported permission type.');
    }
    return query.then((response: any) => {
      if (Array.isArray(response)) {
        const isRejected = response.find(o => o.status !== 'granted');
        if (isRejected) {
          return Promise.reject(rejectionMsgMap.get(type));
        }
      } else if (response && response.status !== 'granted') {
        return Promise.reject(rejectionMsgMap.get(type));
      }
      return Promise.resolve();
    }, (error: any) => {
      console.log('permission is not enabled ', error);
      return Promise.reject();
    });
  }
}
