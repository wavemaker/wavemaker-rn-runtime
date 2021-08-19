import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';

export interface CameraInput extends Input {
  allowImageEdit: boolean;
  imageQuality: number;
  imageEncodingType: number;
  imageTargetWidth: number;
  imageTargetHeight: number;
}

export interface CameraService {
  captureImage: (params: CameraInput) => any
  captureVideo: () => any;
}
