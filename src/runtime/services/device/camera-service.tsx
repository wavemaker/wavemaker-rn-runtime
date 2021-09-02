import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { CameraType } from "expo-camera/build/Camera.types";

import { DisplayManager } from "@wavemaker/app-rn-runtime/core/display.manager";
import { CaptureVideoOutput } from "@wavemaker/app-rn-runtime/variables/device/camera/capture-video.operation";
import { CaptureImageOutput } from "@wavemaker/app-rn-runtime/variables/device/camera/capture-image.operation";
import permissionManager from '@wavemaker/app-rn-runtime/runtime/services/device/permissions';
import { CameraInput } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Input } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";
import appDisplayManagerService from "@wavemaker/app-rn-runtime/runtime/services/app-display-manager.service";
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
    padding: 20
  } as ViewStyle,
  leftWrapper: {
    flex: 1,
    alignItems: 'flex-start',
  } as ViewStyle,
  midWrapper: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,
  rightWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  } as ViewStyle,
  circle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  outerCircle: {
    borderWidth: 3,
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: 'white'
  },
  innerCircle: {
    borderRadius:2,
    height: 20,
    width:20,
    backgroundColor: 'red'
  }
};

export interface CameraVideoInput extends Input {}

export class CameraService {
  private type= Camera.Constants.Type.back;

  constructor(private displayManager: DisplayManager) {
  }

  public captureVideo(options?: CameraVideoInput): Promise<CaptureVideoOutput> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('video').then(() => {
        const destroy = this.displayManager.show({
          content: (<CameraView type={this.type} captureType={'video'} onSuccess={(o) => {
            destroy.call(this.displayManager);
            resolve({videoPath: o.uri});
          }}
          onCancel={() => {
            destroy.call(this.displayManager);
          }}
          ></CameraView>)
        });
      }, reject);
    });
  }

  public captureImage(params: CameraInput): Promise<CaptureImageOutput> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('image').then(() => {
        const destroy = this.displayManager.show({
          content: (<CameraView type={this.type} captureType={'image'} onSuccess={(o) => {
            destroy.call(this.displayManager);
            resolve({imagePath: o.uri});
          }} onCancel={() => {destroy.call(this.displayManager);}}
          ></CameraView>)
        });
      }, reject);
    });
  }
}

interface CameraOutput {
  uri: string;
}

class CameraViewProps {
  type: 'front' | 'back' = 'back' as CameraType;
  captureType: 'image' | 'video' = 'image';
  onSuccess: (o: CameraOutput) => any = () => {};
  onCancel: () => any = () => {};
}

class CameraViewState {
    recording: boolean = false;
    showActionBtns: boolean = false;
    isPaused: boolean = false;
    cameraType: CameraType = 'back' as CameraType;
}

export class CameraView extends React.Component<CameraViewProps, CameraViewState> {
  private camera: Camera = {} as Camera;
  private cameraContent: CameraOutput = {} as CameraOutput;

  constructor(props: CameraViewProps) {
    super(props);
    this.state = new CameraViewState();
  }

  toggleCapture() {
    if (this.props.captureType === 'image') {
      this.takePicture();
    }
    if (!this.state.recording) {
      this.startRecord();
    } else {
      this.stopRecord();
      this.setState({showActionBtns: true});
    }
  }

  async takePicture() {
    if (this.state.showActionBtns) {
      this.setState({showActionBtns: false});
    }
    this.setState({showActionBtns: true});
    this.cameraContent = await this.camera.takePictureAsync();
    if (this.cameraContent.uri) {
      this.setState({isPaused: true});
      await this.camera.pausePreview();
    }
  }

  // start recording
  startRecord = async () => {
    if (this.state.showActionBtns) {
      this.setState({showActionBtns: false});
    }

    this.setState({recording: true}, async () => {
      this.cameraContent = await this.camera.recordAsync();
    });
  };

  // stop recording
  stopRecord = async () => {
    this.camera.stopRecording();
    this.setState({recording: false});
    this.setState({showActionBtns: true});
  };

  render() {
    return (<Camera type={this.state.cameraType} ref={(ref: Camera) => { this.camera = ref; }}
            style={StyleSheet.absoluteFillObject}
            onCameraReady={() => {}}>
      <View style={styles.actionBar}>
        <View style={styles.leftWrapper}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.isPaused) {
                this.camera.resumePreview();
              }
              this.props.onCancel();
            }}>
            <Ionicons name='close-circle' size={32} color='white' />
          </TouchableOpacity>
        </View>
        <View style={styles.midWrapper}>
        <TouchableOpacity style={[styles.circle, styles.outerCircle, this.props.captureType === 'video' && !this.state.recording ? { backgroundColor: "red" } : {},
          this.props.captureType === 'image' ? { backgroundColor: "white" } : {}]}
                          onPress={this.toggleCapture.bind(this)}>
          <View style={[styles.circle as ViewStyle, this.props.captureType === 'image' ? {} : styles.innerCircle, this.props.captureType === 'image' ? { backgroundColor: "white" } : {}]}></View>
        </TouchableOpacity>
        </View>
        <View style={styles.rightWrapper}>
          {this.state.showActionBtns ? (<TouchableOpacity
            onPress={() => {
              this.camera.resumePreview();
              this.props.onSuccess(this.cameraContent);
              return;
            }}>
            <Ionicons name='checkmark-circle' size={32} color='white'/>
          </TouchableOpacity>) : (<TouchableOpacity
            onPress={() => {
              this.setState({cameraType: this.state.cameraType === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back});
            }}>
            <Ionicons name='camera-reverse' size={32} color='white' />
          </TouchableOpacity>)}
        </View>
      </View>
    </Camera>)
  }
}
const cameraService = new CameraService(appDisplayManagerService);
export default cameraService;
