import {Input} from "@wavemaker/app-rn-runtime/variables/device/operation.provider";

export interface GeoPositionInput extends Input {
  maximumAge: number;
  timeout: number;
  enableHighAccuracy: boolean;
}

export interface LocationService {
  getCurrentGeoPosition: (params: GeoPositionInput) => any;
}
