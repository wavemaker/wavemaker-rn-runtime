import { Operation, Input, Output } from '../operation.provider';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import React from 'react';
import { DisplayManager } from '@wavemaker/app-rn-runtime/core/display.manager';

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

const styles = {
  actionBtn: {
    flex: 0,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  } as ViewStyle,
  actionBar: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  } as ViewStyle,
  wrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  } as ViewStyle,
};

export class CaptureImageOperation implements Operation {
  private type= Camera.Constants.Type.back;
  constructor(private displayManager: DisplayManager) {
    this.displayManager = displayManager;
  }

  public invoke(params: CameraInput): Promise<CaptureImageOutput> {
    let camera: Camera;
    return Camera.requestPermissionsAsync().then(response => {
      if (response.status !== 'granted') {
        return Promise.reject('Camera access is not enabled in the app.');
      }
      return new Promise((resolve, reject) => {
        const destroy = this.displayManager.show({
          content: (<Camera type={this.type} ref={(ref: Camera) => { camera = ref }}
                            style={StyleSheet.absoluteFillObject}
                            onCameraReady={() => {}}>
            <View style={styles.wrapper}>
              <TouchableOpacity
                onPress={() => {
                  this.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                }}>
                <Ionicons name='camera-reverse' size={32} color='white' />
              </TouchableOpacity>
            </View>
              <View style={styles.actionBar}>
                <TouchableOpacity onPress={async () => {
                  const cameraOptions = {
                    quality: 0 || params.imageQuality,
                  }
                  const result = await camera.takePictureAsync();
                  destroy.call(this.displayManager);
                  return resolve({imagePath: result.uri} as CaptureImageOutput);
                }} style={styles.actionBtn}>
                  <Ionicons name="camera" size={24} color="white" />
                </TouchableOpacity>
              </View>
          </Camera>)
        });
      });
    })
  }
}
