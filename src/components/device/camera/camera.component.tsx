import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCameraProps from './camera.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmCameraStyles } from './camera.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { CaptureImageOutput } from '@wavemaker/app-rn-runtime/variables/device/camera/capture-image.operation';
import { CameraConsumer, CameraInput, CameraService } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { CaptureVideoOutput } from '@wavemaker/app-rn-runtime/variables/device/camera/capture-video.operation';


export class WmCameraState extends BaseComponentState<WmCameraProps> {}

export default class WmCamera extends BaseComponent<WmCameraProps, WmCameraState, WmCameraStyles> {
  private camera: CameraService = null as any;
  constructor(props: WmCameraProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmCameraProps());
  }

  onCameraTap() {
    const props = this.state.props;
    if (props.capturetype === 'IMAGE') {
      const params: CameraInput = {
        allowImageEdit: props.allowedit,
        imageQuality: props.imagequality,
        imageEncodingType: props.imageencodingtype,
        imageTargetWidth: props.imagetargetwidth,
        imageTargetHeight: props.imagetargetheight
      };

      this.camera.captureImage(params).then((res: CaptureImageOutput) => {
        this.updateModel(null, res.imagePath);
        this.invokeEventCallback('onSuccess', [null, this.proxy, res.imagePath]);
      });
    } else {
      this.camera.captureVideo().then((res: CaptureVideoOutput) => {
        this.updateModel(null, res.videoPath);
        this.invokeEventCallback('onSuccess', [null, this.proxy, res.videoPath]);
      });
    }

  }

  private updateModel($event: any, value: any) {
    value = (value.startsWith('file://') ? '' : 'file://') + value;
    this.updateState({
      props: {
        datavalue: value,
        localFilePath: value
      }
    } as WmCameraState);
  }

  renderWidget(props: WmCameraProps) {
    return (
          <CameraConsumer>
              {(cameraService: CameraService) => {
              this.camera = cameraService;
              return <View style={this.styles.root}>
                <WmButton iconclass={props.iconclass} styles={this.styles.button} iconsize={props.iconsize} onTap={this.onCameraTap.bind(this)}></WmButton>
              </View>
            }}
          </CameraConsumer>
    );
  }
}