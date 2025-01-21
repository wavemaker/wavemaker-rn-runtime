import React from 'react';
import { Platform, View } from 'react-native';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFileuploadProps from './fileupload.props';
import { DEFAULT_CLASS, WmFileuploadStyles } from './fileupload.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { getMimeType } from '@wavemaker/app-rn-runtime/core/utils';
import { FileUploadPluginConsumer, FileUploadPluginService } from '@wavemaker/app-rn-runtime/core/device/fileupload-service';

export interface SelectFileOutput {
  mimeType: string;
  name: string;
  size: number;
  type: 'cancel' | 'success';
  uri: string;
}

export class WmFileuploadState extends BaseComponentState<WmFileuploadProps> {
  selectedFiles: any;
}

type NamedParametersType = {
  copyToCacheDirectory: boolean,
  multiple: boolean,
  type: string | string[]
};

const namedParameters: NamedParametersType = {
  copyToCacheDirectory: false,
  multiple: false,
  type: '*/*'
};

export default class WmFileupload extends BaseComponent<WmFileuploadProps, WmFileuploadState, WmFileuploadStyles> {
  public fileUploadService: any = null as any;

  constructor(props: WmFileuploadProps) {
    super(props, DEFAULT_CLASS, new WmFileuploadProps());
  }

  onTap(props: WmFileuploadProps) {
    namedParameters.type = getMimeType(props.contenttype);
    this.fileUploadService.getDocumentAsync(namedParameters).then((response: any) => {
      let selectedFile;
      if (Platform.OS !== 'web') {
        selectedFile = response.assets[0];
        selectedFile.type = selectedFile.mimeType;
      } else {
        selectedFile = [response.assets[0].file];
      }
      this.invokeEventCallback('onBeforeselect', [null, this.proxy, selectedFile]);

      this.updateState({
          props: {
          selectedFiles: selectedFile
        }
      } as WmFileuploadState, this.invokeEventCallback.bind(this, 'onSelect', [null, this.proxy, selectedFile]));
    });
  }

  renderWidget(props: WmFileuploadProps) {
    return (
      <FileUploadPluginConsumer>
      {(fileUploadPluginService: FileUploadPluginService) => {
      this.fileUploadService = fileUploadPluginService;
      return (
        <View style={this.styles.root}>
          {this._background}
          <WmButton accessibilitylabel={props.accessibilitylabel || props.caption} hint = {props.hint} id={this.getTestId()} iconclass={props.iconclass} caption={props.caption} styles={this.styles.button} iconsize={props.iconsize} onTap={() => this.onTap.bind(this)(props)}></WmButton>
        </View>
      )}}
      </FileUploadPluginConsumer>
    )
  }
}
