import React from 'react';

enum FileSystemSessionType {
  BACKGROUND = 0,
  FOREGROUND = 1,
}

type Options = {
    mimeType?: string;
    UTI?: string;
    dialogTitle?: string;
};

type FileInfo =
    | {
        exists: true;
        uri: string;
        size: number;
        isDirectory: boolean;
        modificationTime: number;
        md5?: string;
    }
    | {
        exists: false;
        uri: string;
        isDirectory: false;
    };

type InfoOptions = {
    md5?: boolean;
    size?: boolean;
};

type DownloadOptions = {
  md5?: boolean;
  cache?: boolean;
  headers?: Record<string, string>;
  sessionType?: FileSystemSessionType;
};

type DownloadProgressData = {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
};

type UploadProgressData = {
  totalBytesSent: number;
  totalBytesExpectedToSend: number;
};

type FileSystemNetworkTaskProgressCallback<
  T extends DownloadProgressData | UploadProgressData,
> = (data: T) => void;

// * expo-sharing and expo-file-system plugin
export interface OpenFilePluginService {
    isAvailableAsync: () => Promise<boolean>;
    shareAsync: (url: string, options?: Options) => Promise<void>;
    getInfoAsync: (
        fileUri: string,
        options?: InfoOptions
    ) => Promise<FileInfo>;
    cacheDirectory: string | null;
    createDownloadResumable: (
        uri: string,
        fileUri: string,
        options?: DownloadOptions,
        callback?: FileSystemNetworkTaskProgressCallback<DownloadProgressData>,
        resumeData?: string
    ) => any;
}
const OpenFilePluginContext = React.createContext<OpenFilePluginService>(
    null as any
);

export const OpenFilePluginProvider = OpenFilePluginContext.Provider;
export const OpenFilePluginConsumer = OpenFilePluginContext.Consumer;
