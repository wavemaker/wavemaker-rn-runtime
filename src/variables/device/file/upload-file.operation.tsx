import React from 'react';
import axios from 'axios';
import { Platform } from 'react-native';
import { endsWith } from 'lodash-es';

import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import { FileExtensionTypesMap } from '@wavemaker/app-rn-runtime/core/file-extension-types';
import { FileUploadPluginConsumer, FileUploadPluginService } from '@wavemaker/app-rn-runtime/core/device/fileupload-service';

export interface UploadFileInput {
  localFile: string;
  remoteFolder: string;
  serverUrl: string;
  browse: boolean;
}

export interface UploadFileOutput {
  fileName: string;
  path: string;
  length: number;
  success: boolean;
  inlinePath: string;
  errorMessage: string;
}

const namedParameters = {
  copyToCacheDirectory: false,
  multiple: false,
  type: '*/*'
};

export class UploadFileOperation implements Operation {
  public fileUploadService: any = null as any;

  public setFileUploadService(service: FileUploadPluginService) {
    this.fileUploadService = service;
  }

  public chooseFile() {
    return this.fileUploadService?.getDocumentAsync(namedParameters).then((response: any) => {
      return Platform.OS === 'web' ? response.file : response.uri;
    });
  }

  public invoke(params: UploadFileInput): any {
    params.serverUrl = endsWith(params.serverUrl, '/') ? params.serverUrl : params.serverUrl + '/';
    let serverUrl = params.serverUrl + 'services/file/uploadFile';
    if (params.remoteFolder) {
      serverUrl = serverUrl + '?relativePath=' + params.remoteFolder
    }
    return Promise.resolve().then(() => {
      if (!params.localFile && params.browse) {
        return (
          <FileUploadPluginConsumer>
            {(fileUploadPluginService: FileUploadPluginService) => {
              this.fileUploadService = fileUploadPluginService;
              return this.chooseFile();
            }}
          </FileUploadPluginConsumer>
        ) as any;
      } else {
        return params.localFile;
      }
    }).then((filePath: string) => {
      if (!filePath) {
        return;
      }
      const fileName: string | undefined = filePath.split('/').pop() || '';
      const arr: any = fileName.split('.');
      const fileExtension: string = '.' + arr[arr.length - 1];
      let fileObj = {
        uri: filePath,
        type: FileExtensionTypesMap[fileExtension],
        name: fileName,
      };

      let formData = new FormData();
      formData.append('files', fileObj as any);
      return axios({
        url: serverUrl,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      }).then(
        (response) => {
        return response.data[0];
      }, error => error);
    });
  }
}
