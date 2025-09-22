import { Input, Operation, Output } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";
import { LocationPluginService, LocationService } from "@wavemaker/app-rn-runtime/core/device/location-service";
import { PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

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
  permissionService: any;
  locationPluginService: any;
}

export class CurrentGeoPositionOperation implements Operation {
  constructor(private location: LocationService, private permissionService: PermissionService, private locationPluginService: LocationPluginService) {
  }

  public invoke(params: GeoPositionInput): any {
    return this.location.getCurrentGeoPosition({...params, locationPluginService: this.locationPluginService, permissionService: this.permissionService});
  }
}
