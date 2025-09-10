import {
  GeoPositionInput,
  GeoPositionOutput
} from "@wavemaker/app-rn-runtime/variables/device/device/current-geo-position.operation";


export class LocationService {

  constructor() {}

  public getCurrentGeoPosition(params: GeoPositionInput): Promise<GeoPositionOutput> {
    return new Promise((resolve, reject) => {
      params?.permissionService?.requestPermissions('location').then(() => {
        const options = {
          accuracy: 4
        }
          resolve(params?.locationPluginService?.getCurrentPositionAsync(options));
        }, reject)
      });
  }
}
