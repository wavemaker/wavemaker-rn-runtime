import { Operation } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";

export interface DeviceInfoOutput {
  deviceModel: string;
  os: string;
  osVersion: string;
  deviceUUID: string;
}

export class DeviceInfoOperation implements Operation {
  public invoke(): Promise<any> {
    return Promise.resolve({});
  }
}
