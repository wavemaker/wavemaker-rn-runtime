import { CameraService } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Operation, Output } from '../operation.provider';

export interface CaptureVideoOutput extends Output {
  videoPath: string;
  content: string;
}

export class CaptureVideoOperation implements Operation {
  constructor(private camera: CameraService) {
  }

  public invoke(): Promise<CaptureVideoOutput> {
    return this.camera.captureVideo();
  }
}
