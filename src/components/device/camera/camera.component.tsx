import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmCameraProps from './camera.props';
import { DEFAULT_CLASS, WmCameraStyles } from './camera.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { CaptureImageOutput } from '@wavemaker/app-rn-runtime/variables/device/camera/capture-image.operation';
import { CameraConsumer, CameraInput, CameraService } from "@wavemaker/app-rn-runtime/core/device/camera-service";
import { CaptureVideoOutput } from '@wavemaker/app-rn-runtime/variables/device/camera/capture-video.operation';
import { AccessibilityWidgetType, getAccessibilityProps } from '@wavemaker/app-rn-runtime/core/accessibility'; 


export class WmCameraState extends BaseComponentState<WmCameraProps> {}

export default class WmCamera extends BaseComponent<WmCameraProps, WmCameraState, WmCameraStyles> {
  private camera: CameraService = null as any;
  public localFile: string = '';
  constructor(props: WmCameraProps) {
    super(props, DEFAULT_CLASS, new WmCameraProps());
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
        this.updateModel(null, res.imagePath, res.content);
      });
    } else {
      this.camera.captureVideo().then((res: CaptureVideoOutput) => {
        this.updateModel(null, res.videoPath, res.content);
      });
    }

  }

  private updateModel($event: any, value: any, content: string) {
    value = (value.startsWith('file://') ? '' : 'file://') + value;
    this.localFile = content;
    this.updateState({
      props: {
        datavalue: value,
        localFilePath: value
      }
    } as WmCameraState, this.invokeEventCallback.bind(this, 'onSuccess', [null, this.proxy, value, this.localFile]));
  }

  renderWidget(props: WmCameraProps) {
    return (
          <CameraConsumer>
              {(cameraService: CameraService) => {
              {this._background}
              this.camera = cameraService;
              return <View style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
                <WmButton id={this.getTestId('button')} caption={props.caption} iconclass={props.iconclass} iconsize={props.iconsize} iconposition={props.caption ? '' : 'left'} styles={this.styles.button} onTap={this.onCameraTap.bind(this)} accessibilitylabel={props.accessibilitylabel} hint={props.hint} accessibilityrole={props.accessibilityrole}></WmButton>
              </View>
            }}
          </CameraConsumer>
    );
  }
}
