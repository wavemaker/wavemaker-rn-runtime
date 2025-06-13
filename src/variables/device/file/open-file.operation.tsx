import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { Operation } from '@wavemaker/app-rn-runtime/variables/device/operation.provider';
import { FileExtensionTypesMap } from '@wavemaker/app-rn-runtime/core/file-extension-types';

// Supported file extensions mentioned in Wavemaker docs [https://docs.wavemaker.com/learn/app-development/variables/device-variables#openfile]
const supportedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']

export interface OpenFileInput {
  filePath: string;
  fileType: string;
  serverUrl: string;
}

export interface OpenFileOutput extends OpenFileInput {
  fileLocalPath: string;
}

export class OpenFileOperation implements Operation {
  public openInShare(data: OpenFileOutput) {
    if(!data || !data.fileLocalPath){
      return Promise.reject('unable to open the file'); 
    }

    return Sharing.isAvailableAsync().then((response: boolean) => {
      if(response) {
        const fileName = data.filePath.split('/')[data.filePath.split('/').length - 1];
        Sharing.shareAsync(data.fileLocalPath, {
            mimeType: FileExtensionTypesMap[this.getFileExtension(fileName)]
        });
        return data;
      } else {
        return Promise.reject('unable to open the file');
      }
    })
  }

  public checkIfFileExists(fileLocation: string) {
    return FileSystem.getInfoAsync(fileLocation).then(fileInfo => fileInfo);
  }

  public getFileExtension(fileName: string): string {
    const arr = fileName.split('.');
    const fileExtension = ('.' + arr[arr.length - 1]).toLocaleLowerCase();
    return fileExtension;
  }
  public checkIfSupportedFile(fileName: string): boolean {
    const fileExtension = this.getFileExtension(fileName);
    if (supportedExtensions.includes(fileExtension)) {
      return true
    }

    return false
  }

  public invoke(params: OpenFileInput): Promise<OpenFileOutput> {
    if (FileSystem.cacheDirectory === null) {
      return Promise.reject('Error is setting up device directory');
    }
    const fileName = params.filePath.split('/')[params.filePath.split('/').length - 1];

    if(!this.checkIfSupportedFile(fileName)) {
        return Promise.reject('Unsupported file');
    }
    
    const fileLocation = FileSystem.cacheDirectory + fileName;

    return Promise.resolve().then(() => {
      return this.checkIfFileExists(fileLocation)
    }).then((data: any) => {
      if (data.exists && data.uri) {
        return { fileLocalPath: fileLocation, ...params };
      }

      const downloadResumable = FileSystem.createDownloadResumable(
        params.filePath,
        fileLocation,
        {
          cache: true
        },
        () => { }
      );

      return downloadResumable.downloadAsync()
        .then((response) => {
          return { fileLocalPath: fileLocation, ...params };
        })
    }).then((response: OpenFileOutput) => {
      return this.openInShare(response)
    });
  }
}
