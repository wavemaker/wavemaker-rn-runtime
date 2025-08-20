import {CameraInput, CameraService} from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Operation, Output } from '../operation.provider';
import { PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface CaptureImageOutput extends Output {
  imagePath: string;
  content: string;
}

export class CaptureImageOperation implements Operation {
  constructor(private camera: CameraService, private permissionService: PermissionService) {}

  public invoke(params: CameraInput) {
    return this.camera.captureImage({...params, permissionService: this.permissionService});
  }
}
