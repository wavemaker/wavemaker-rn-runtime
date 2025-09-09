import { Input } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import React from 'react';

export interface CameraInput extends Input {
  allowImageEdit: boolean;
  imageQuality: number;
  imageEncodingType: string;
  imageTargetWidth: number;
  imageTargetHeight: number;
  permissionService: any;
}

export interface CameraVideoInput {
  permissionService: any;
}

export interface CameraService {
  captureImage: (params: CameraInput) => any
  captureVideo: (params: CameraVideoInput) => any;
}
const CameraContext = React.createContext<CameraService>(null as any);

export const CameraProvider = CameraContext.Provider;
export const CameraConsumer = CameraContext.Consumer;

// * expo-camera plugin
export interface CameraPluginService {
  CameraView: any;
  Video: any;
  fsReadAsString: (uri: any, params: any) => any;
}
const CameraPluginContext = React.createContext<CameraPluginService>(null as any);

export const CameraPluginProvider = CameraPluginContext.Provider;
export const CameraPluginConsumer = CameraPluginContext.Consumer;
