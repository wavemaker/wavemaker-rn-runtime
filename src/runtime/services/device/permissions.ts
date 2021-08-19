import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

const rejectionMsgMap = new Map<string, string>();

rejectionMsgMap.set('camera', 'camera permission is required to capture image');
rejectionMsgMap.set('video', 'camera and audio permissions are required to capture video');
rejectionMsgMap.set('location', 'enable geolocation permission to access the location');
rejectionMsgMap.set('contacts', 'enable contacts permission to access the contacts');
rejectionMsgMap.set('calendar', 'enable calendar permission to access the calendar events');

interface objectMap {
  [key: string]: Array<string>
}

const permissionsStr: objectMap = {
  CAMERA: [Permissions.CAMERA],
  IMAGE: [Permissions.CAMERA],
  VIDEO: [Permissions.CAMERA, Permissions.AUDIO_RECORDING],
}

const checkStatus = (type: string): Promise<Permissions.PermissionResponse> => {
  const permissions: any = permissionsStr[type.toUpperCase()].join(',');
  return Permissions.getAsync(permissions).then(response => {
    if (response.status !== 'granted') {
      return Permissions.askAsync(permissions);
    }
    return Promise.resolve(response);
  });
}

export default {
  requestPermissions: (type: string) => {
    let query;
    if (type === 'location') {
      // requestPermissionsAsync is deprecated and requestForegroundPermissionsAsync is available only in sdk 41+
      query = Location.requestPermissionsAsync();
    } else if (type === 'image' || type === 'camera' || type === 'video') {
      query = checkStatus(type);
    } else if(type === 'contacts') {
      query = Contacts.requestPermissionsAsync();
    } else if(type === 'calendar') {
      query = Calendar.requestCalendarPermissionsAsync();
    }
    if (!query) {
      return Promise.reject('no supported permission type.');
    }
    return query.then((response: any) => {
      if (response.status !== 'granted') {
        return Promise.reject(rejectionMsgMap.get(type));
      }
      return Promise.resolve();
    }, (error: any) => {
      console.log('permission is not enabled ', error);
      return Promise.reject();
    });
  }
}
