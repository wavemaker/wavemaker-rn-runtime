import { IDeviceVariableOperation } from "@wavemaker/app-rn-runtime/variables/device-variable";
import { CaptureImageOperation } from "@wavemaker/app-rn-runtime/variables/device/capture-image-operation";
import {DeviceVariableService} from "@wavemaker/app-rn-runtime/variables/device/device-variable-service";

export class CameraService extends DeviceVariableService {
  public readonly name = 'camera';
  public readonly operations: IDeviceVariableOperation[] = [];

  constructor() {
    super();
    this.operations.push(new CaptureImageOperation());
  }}
