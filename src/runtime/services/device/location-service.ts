import * as Location from 'expo-location';
import permissionManager from "@wavemaker/app-rn-runtime/runtime/services/device/permissions";
import {
  GeoPositionInput,
  GeoPositionOutput
} from "@wavemaker/app-rn-runtime/variables/device/device/current-geo-position.operation";


export class LocationService {

  constructor() {}

  public getCurrentGeoPosition(params: GeoPositionInput): Promise<GeoPositionOutput> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('location').then(() => {
        const options = {
          accuracy: 4
        }
          resolve(Location.getCurrentPositionAsync(options));
        }, reject)
      });
  }
}
