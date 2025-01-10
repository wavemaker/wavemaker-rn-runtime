import axios from 'axios';
import { Platform } from 'react-native';
import { endsWith } from 'lodash-es';
import * as DocumentPicker from 'expo-document-picker';

import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import { FileExtensionTypesMap } from '@wavemaker/app-rn-runtime/core/file-extension-types';

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

  public chooseFile() {
    return DocumentPicker.getDocumentAsync(namedParameters).then((response: any) => {
      const assets = response?.assets[0];
      return { uri: assets.uri, name: assets.name };
    });
  }

  public invoke(params: UploadFileInput): Promise<UploadFileOutput> {
    params.serverUrl = endsWith(params.serverUrl, '/') ? params.serverUrl : params.serverUrl + '/';
    let serverUrl = params.serverUrl + 'services/file/uploadFile';
    if (params.remoteFolder) {
      serverUrl = serverUrl + '?relativePath=' + params.remoteFolder
    }
    return Promise.resolve().then(() => {
      if (!params.localFile && params.browse) {
        return this.chooseFile();
      } else {
        const name: string | undefined = params.localFile.split('/').pop() || '';
        return { uri: params.localFile, name: name };
      }
    }).then((data: { uri: string | undefined, name: string }) => {
      if (!data || !data?.uri) {
        return;
      }
      const fileName: string | undefined = data.name;
      const arr: any = fileName.split('.');
      const fileExtension: string = ('.' + arr[arr.length - 1]).toLocaleLowerCase();
      let fileObj = {
        uri: data.uri,
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
