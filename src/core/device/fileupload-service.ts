import React from 'react';

// * expo-document-picker plugin
export interface FileUploadPluginService {
  getDocumentAsync: any;
}
const FileUploadPluginContext = React.createContext<FileUploadPluginService>(null as any);

export const FileUploadPluginProvider = FileUploadPluginContext.Provider;
export const FileUploadPluginConsumer = FileUploadPluginContext.Consumer;
