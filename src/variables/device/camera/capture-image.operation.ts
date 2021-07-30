import * as ImagePicker from 'expo-image-picker';

import {Operation, Input, Output} from '../operation.provider';

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

export class CaptureImageOperation implements Operation {

  public invoke(params: CameraInput): Promise<CaptureImageOutput> {
    return ImagePicker.requestCameraPermissionsAsync().then((response: any) => {
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
      }).then((result: any) => {
          return {imagePath: result.cancelled ? null : result.uri} as CaptureImageOutput;
      });
  }
}
