import axios from 'axios';
import { endsWith } from 'lodash-es';

import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import { FileExtensionTypesMap } from '@wavemaker/app-rn-runtime/core/file-extension-types';

export interface UploadFileInput {
  localFile: string;
  remoteFolder: string;
  serverUrl: string;
}

export interface UploadFileOutput {
  fileName: string;
  path: string;
  length: number;
  success: boolean;
  inlinePath: string;
  errorMessage: string;
}

export class UploadFileOperation implements Operation {

  public invoke(params: UploadFileInput): Promise<UploadFileOutput> {
    params.serverUrl = endsWith(params.serverUrl, '/') ? params.serverUrl : params.serverUrl + '/';
    let serverUrl = params.serverUrl + 'services/file/uploadFile';
    if (params.remoteFolder) {
      serverUrl = serverUrl + '?relativePath=' + params.remoteFolder
    }
    const filePath = params.localFile;
    const fileName: string | undefined = filePath.split('/').pop() || '';
    const arr: any = fileName.split('.');
    const fileExtension: string = '.' + arr[arr.length - 1];
    let fileObj = {
      uri: filePath,
      type: FileExtensionTypesMap[fileExtension],
      name: fileName,
    };

    let formData = new FormData();
    formData.append('files', fileObj);
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
  }
}
