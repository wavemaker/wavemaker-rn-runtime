import React from "react";
import { ImageBackground, TouchableOpacity, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Camera, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";

import { DisplayManager } from "@wavemaker/app-rn-runtime/core/display.manager";
import { CaptureVideoOutput } from "@wavemaker/app-rn-runtime/variables/device/camera/capture-video.operation";
import { CaptureImageOutput } from "@wavemaker/app-rn-runtime/variables/device/camera/capture-image.operation";
import permissionManager from '@wavemaker/app-rn-runtime/runtime/services/device/permissions';
import { CameraInput } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { Input } from "@wavemaker/app-rn-runtime/variables/device/operation.provider";
import appDisplayManagerService from "@wavemaker/app-rn-runtime/runtime/services/app-display-manager.service";
const styles = {
  preview: {
    top: 0,
    left: 0,
    right: 0,
    flexGrow: 1,
    backgroundColor: 'black'
  },
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
    justifyContent: 'center',
    alignItems: 'flex-start',
  } as ViewStyle,
  midWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  rightWrapper: {
    flex: 1,
    justifyContent: 'center',
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
  private type= CameraType.back;

  constructor(private displayManager: DisplayManager) {
  }

  public captureVideo(options?: CameraVideoInput): Promise<CaptureVideoOutput> {
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('video').then(() => {
        const destroy = this.displayManager.show({
          content: (<CameraView type={this.type} captureType={'video'} onSuccess={(o) => {
            destroy.call(this.displayManager);
            /*o.content().catch(() => {}).then(base64 => {
              resolve({videoPath: o.uri, content: base64 || ''});
            });*/
            resolve({videoPath: o.uri, content: ''});
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
            o.content().catch(() => {}).then(base64 => {
              resolve({imagePath: o.uri, content: base64 || ''});
            });
          }} onCancel={() => {destroy.call(this.displayManager);}}
          ></CameraView>)
        });
      }, reject);
    });
  }
}

interface CameraOutput {
  uri: string;
  content: () => Promise<string>;
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
    cameraType: CameraType = CameraType.back;
    isCaptured: boolean = false;
    closeView: boolean = false;
    cameraContent: CameraOutput = {} as CameraOutput;
}

export class CameraView extends React.Component<CameraViewProps, CameraViewState> {
  private camera: Camera = {} as Camera;

  constructor(props: CameraViewProps) {
    super(props);
    this.state = new CameraViewState();
  }

  toggleCapture() {
    if (this.props.captureType === 'image') {
      this.takePicture();
    } else {
      if (!this.state.recording) {
        this.startRecord();
      } else {
        this.stopRecord();
        this.setState({showActionBtns: true} as CameraViewState);
      }
    }
  }

  async takePicture() {
    const options = {
      quality: 0.5,
      base64: false,
      skipProcessing: true,
      onPictureSaved: (response: any) => {
        response.content = async () => {
          return await FileSystem.readAsStringAsync(response.uri, { encoding: 'base64' });
        };
        this.setState({ 
          cameraContent: response,
          isCaptured: true,
          showActionBtns: true } as CameraViewState);
      }
    }
    await this.camera.takePictureAsync(options);

    if (this.state.showActionBtns) {
      this.setState({showActionBtns: false} as CameraViewState);
    }
    this.setState({showActionBtns: true} as CameraViewState);
  }

  // start recording
  startRecord = async () => {
    this.camera.recordAsync().then((response: any) => {
      response.content = async () => {
        return await FileSystem.readAsStringAsync(response.uri, { encoding: 'base64' });
      };
      this.setState({ cameraContent: response, isCaptured: true } as CameraViewState);
    });
    if (this.state.showActionBtns) {
      this.setState({showActionBtns: false} as CameraViewState);
    }

    this.setState({recording: true} as CameraViewState);
  };

  // stop recording
  stopRecord = async () => {
    this.camera.stopRecording();
    this.setState({recording: false} as CameraViewState);
    this.setState({showActionBtns: true} as CameraViewState);
  };

  getActionsTemplate() {
    return <View style={styles.actionBar}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ cameraContent: {uri: ''}, isCaptured: false,  closeView: true } as CameraViewState);
            this.props.onCancel();
          }}>
          <Ionicons name='close-circle' size={32} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.midWrapper}>
        {!this.state.isCaptured ? <TouchableOpacity style={[styles.circle, styles.outerCircle, this.props.captureType === 'video' && !this.state.recording ? { backgroundColor: "red" } : {},
          this.props.captureType === 'image' ? { backgroundColor: "white" } : {}]}
                          onPress={this.toggleCapture.bind(this)}>
          <View style={[styles.circle as ViewStyle, this.props.captureType === 'image' ? {} : styles.innerCircle, this.props.captureType === 'image' ? { backgroundColor: "white" } : {}]}></View>
        </TouchableOpacity> : null}
      </View>
      <View style={styles.rightWrapper}>
        {this.state.showActionBtns ? (<TouchableOpacity
          onPress={() => {
            this.setState({ isCaptured: false, closeView: true } as CameraViewState);
            this.props.onSuccess(this.state.cameraContent);
            this.setState({ cameraContent: {uri: ''} } as CameraViewState);
          }}>
          <Ionicons name='checkmark-circle' size={32} color='white'/>
        </TouchableOpacity>) : (<TouchableOpacity
          onPress={() => {
            this.setState({cameraType: this.state.cameraType === 'back' ? 'front' : 'back'} as CameraViewState);
          }}>
          <Ionicons name='camera-reverse' size={32} color='white' />
        </TouchableOpacity>)}
      </View>
    </View>
  }

  getPreviewTemplate(actions: any) {
    return this.props.captureType === 'image' ?
      <ImageBackground source={{uri : this.state.cameraContent.uri}} resizeMode={ResizeMode.CONTAIN} style={{flex: 1}} />
      : <Video
          style={{ flex: 1 }}
          source={{
            uri: this.state.cameraContent.uri,
          }}
          shouldPlay={true}
          useNativeControls
          isLooping
          resizeMode={ResizeMode.CONTAIN}
        ></Video>
  }

  render() {
    if (this.state.closeView) {
      return null;
    }
    const actions = this.getActionsTemplate();
    return (
      <View style={styles.preview}>
        {this.state.isCaptured ? (
          this.getPreviewTemplate(actions)
        ) : (
          <Camera type={CameraType[this.state.cameraType]} ref={(ref: Camera) => { this.camera = ref; }}
              style={{flex: 1}}
              onCameraReady={() => {}}>

          </Camera>)}
        {actions}
      </View>)
  }
}
const cameraService = new CameraService(appDisplayManagerService);
export default cameraService;
