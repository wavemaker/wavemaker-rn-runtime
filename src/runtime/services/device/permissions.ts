// import * as Location from 'expo-location';
// import * as Contacts from 'expo-contacts';
// import * as Calendar from 'expo-calendar';
// import * as Camera from 'expo-camera';
import { Platform } from 'react-native';

const rejectionMsgMap = new Map<string, string>();

rejectionMsgMap.set('camera', 'camera permission is required to capture image');
rejectionMsgMap.set('video', 'camera and audio permissions are required to capture video');
rejectionMsgMap.set('location', 'enable geolocation permission to access the location');
rejectionMsgMap.set('contacts', 'enable contacts permission to access the contacts');
rejectionMsgMap.set('calendar', 'enable calendar permission to access the calendar events');

interface objectMap {
  [key: string]: Array<string>
}

async function getPermissionQuery(type: string) {
  try {
    const Camera = await import('expo-camera');
    let query;
    if (type === 'location') {
      // requestPermissionsAsync is deprecated and requestForegroundPermissionsAsync is available only in sdk 41+
      const Location = await import('expo-location');
      if (Location) {
        query = await Location.requestForegroundPermissionsAsync();
      }
    } else if (type === 'video') {
      if (Camera) {
        query = Promise.all([Camera.requestCameraPermissionsAsync(), Camera.requestMicrophonePermissionsAsync()]);
      }
    } else if (type === 'image' || type === 'camera') {
      if (Camera) {
        query = await Camera.requestCameraPermissionsAsync();
      }
    } else if (type === 'contacts') {
      const Contacts = await import('expo-contacts');
      if (Contacts) {
        query = await Contacts.requestPermissionsAsync();
      }
    } else if (type === 'calendar') {
      const Calendar = await import('expo-calendar');
      if (Calendar) {
        if (Platform.OS === 'ios') {
          query = Promise.all([Calendar.requestCalendarPermissionsAsync(), Calendar.requestRemindersPermissionsAsync()]);
        } else {
          query = await Calendar.requestCalendarPermissionsAsync();
        }
      }
    }

    return query;
  } catch (error) {
    console.log('Failed to get permission query', error);
    return null;
  }
}

export default {
  requestPermissions: async (type: string) => {
  try {
    const query = getPermissionQuery(type);
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
  } catch (error) {
    console.log('Error in requesting permission', error);
  }
  }
}
