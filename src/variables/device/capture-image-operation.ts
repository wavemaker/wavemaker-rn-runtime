import * as ImagePicker from 'expo-image-picker';

import {IDeviceVariableOperation, Input, Output} from '../device-variable';

export interface CameraInput extends Input {
  allowImageEdit: boolean;
  imageQuality: number;
  imageEncodingType: number;
  imageTargetWidth: number;
  imageTargetHeight: number;
}

export interface CaptureImageOutput extends Output {
  imagePath: string
}

export class CaptureImageOperation implements IDeviceVariableOperation {
  public readonly name = 'captureImage';
  public readonly allowImageEdit: boolean = false;
  public readonly imageQuality: number = 80;

  constructor() {}

  public invoke(params: CameraInput): Promise<CaptureImageOutput> {
    return ImagePicker.requestCameraPermissionsAsync().then(response => {
        if (response.status !== 'granted') {
          return Promise.reject('Camera access is not enabled in the app.');
        }
        return ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: params.allowImageEdit,
          aspect: [4, 3],
          quality: 1,
          base64: true
        });
      }).then(result => {
          return {imagePath: result.cancelled ? null : result.uri} as CaptureImageOutput;
      });
  }
}
