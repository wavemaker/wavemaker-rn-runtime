import * as Device from 'expo-device';
import { Operation } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";

export interface DeviceInfoOutput {
  deviceModel: string | null;
  os: string | null;
  osVersion: string | null;
  deviceUUID: string;
}

export class DeviceInfoOperation implements Operation {
  public invoke(): Promise<DeviceInfoOutput> {
    return Promise.resolve({
      deviceModel: Device.modelName,
      os: Device.osName,
      osVersion: Device.osVersion,
      deviceUUID: ''
    });
  }
}
