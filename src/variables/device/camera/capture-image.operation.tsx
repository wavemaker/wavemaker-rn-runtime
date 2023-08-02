import {CameraInput, CameraService} from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Operation, Output } from '../operation.provider';

export interface CaptureImageOutput extends Output {
  imagePath: string;
  content: string;
}

export class CaptureImageOperation implements Operation {
  constructor(private camera: CameraService) {}

  public invoke(params: CameraInput): Promise<CaptureImageOutput> {
    return this.camera.captureImage(params);
  }
}
