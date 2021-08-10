import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

const rejectionMsgMap = new Map<string, string>();

rejectionMsgMap.set('camera', 'camera permission is required to capture image');
rejectionMsgMap.set('video', 'camera and audio permissions are required to capture video');
rejectionMsgMap.set('location', 'enable geolocation permission to access the location');

export default {
  requestPermissions: (type: string) => {
    let query;
    if (type === 'location') {
      // requestPermissionsAsync is deprecated and requestForegroundPermissionsAsync is available only in sdk 41+
      query = Location.requestPermissionsAsync();
    } else if (type === 'image' || type === 'camera') {
      query = Permissions.askAsync(Permissions.CAMERA);
    } else if (type === 'video') {
      query = Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING);
    }
    if (!query) {
      return Promise.reject('no supported permission type.');
    }
    return query.then(response => {
      if (response.status !== 'granted') {
        return Promise.reject(rejectionMsgMap.get(type));
      }
      return Promise.resolve();
    }, error => {
      console.log('permission reject ', error);
    });
  }
}
