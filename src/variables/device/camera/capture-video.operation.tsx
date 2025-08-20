import { CameraService } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Operation, Output } from '../operation.provider';
import { PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface CaptureVideoOutput extends Output {
  videoPath: string;
  content: string;
}

export class CaptureVideoOperation implements Operation {
  constructor(private camera: CameraService, private permissionService: PermissionService) {
  }

  public invoke(): any {
    return this.camera.captureVideo({permissionService: this.permissionService});
  }
}
