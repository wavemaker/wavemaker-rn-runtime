import React from 'react';
import { CameraService } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Operation, Output } from '../operation.provider';
import { PermissionConsumer, PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface CaptureVideoOutput extends Output {
  videoPath: string;
  content: string;
}

export class CaptureVideoOperation implements Operation {
  constructor(private camera: CameraService) {
  }

  public invoke(): any {
    return (
      <PermissionConsumer>
        {(permissionService: PermissionService) => {
          return this.camera.captureVideo({permissionService});
        }}
      </PermissionConsumer>
    )
  }
}
