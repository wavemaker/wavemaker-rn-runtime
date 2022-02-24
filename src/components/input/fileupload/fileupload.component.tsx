import React from 'react';
import { Platform, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmFileuploadProps from './fileupload.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmFileuploadStyles } from './fileupload.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';


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

const namedParameters = {
  copyToCacheDirectory: false,
  multiple: false,
  type: '*/*'
};

export default class WmFileupload extends BaseComponent<WmFileuploadProps, WmFileuploadState, WmFileuploadStyles> {

  constructor(props: WmFileuploadProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmFileuploadProps());
  }

  onTap() {
    DocumentPicker.getDocumentAsync(namedParameters).then((response: any) => {
      let selectedFile;
      if (Platform.OS !== 'web') {
        selectedFile = response;
        selectedFile.type = selectedFile.mimeType;
      } else {
        selectedFile = response.file;
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
    return <View style={this.styles.root}>
      <WmButton iconclass={props.iconclass} caption={props.caption} styles={this.styles.button} iconsize={props.iconsize} onTap={this.onTap.bind(this)}></WmButton>
    </View>
  }
}
