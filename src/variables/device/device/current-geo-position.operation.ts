import { Input, Operation, Output } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";
import { LocationService } from "@wavemaker/app-rn-runtime/core/device/location-service";

export interface coordsOutput {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface GeoPositionOutput extends Output {
  coords: coordsOutput;
  timestamp: number | null;
}

export interface GeoPositionInput extends Input {
  maximumAge: number;
  timeout: number;
  enableHighAccuracy: boolean;
}

export class CurrentGeoPositionOperation implements Operation {
  constructor(private location: LocationService) {
  }

  public invoke(params: GeoPositionInput): Promise<GeoPositionOutput> {
    return this.location.getCurrentGeoPosition(params);
  }
}
