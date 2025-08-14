import {Input} from "@wavemaker/app-rn-runtime/variables/device/operation.provider";
import React from "react";

export interface GeoPositionInput extends Input {
  maximumAge: number;
  timeout: number;
  enableHighAccuracy: boolean;
  permissionService: any;
  locationPluginService: any;
}

export interface LocationService {
  getCurrentGeoPosition: (params: GeoPositionInput) => any;
}

// * expo-location plugin
export interface LocationPluginService {}
const LocationPluginContext = React.createContext<LocationPluginService>(null as any);

export const LocationPluginProvider = LocationPluginContext.Provider;
export const LocationPluginConsumer = LocationPluginContext.Consumer;
