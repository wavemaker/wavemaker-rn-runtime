import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import React from 'react';

export interface CameraInput extends Input {
  allowImageEdit: boolean;
  imageQuality: number;
  imageEncodingType: string;
  imageTargetWidth: number;
  imageTargetHeight: number;
}

export interface CameraService {
  captureImage: (params: CameraInput) => any
  captureVideo: () => any;
}
const CameraContext = React.createContext<CameraService>(null as any);

export const CameraProvider = CameraContext.Provider;
export const CameraConsumer = CameraContext.Consumer;
