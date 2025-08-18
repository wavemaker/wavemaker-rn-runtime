import {ScanInput} from "@wavemaker/app-rn-runtime/variables/device/scan/scan.operation";
import React from 'react';

export interface ScanService {
  scanBarcode: (params: ScanInput) => any;
}
const ScanContext = React.createContext<ScanService>(null as any);

export const ScanProvider = ScanContext.Provider;
export const ScanConsumer = ScanContext.Consumer;

// * scan service plugin
export interface ScanPluginService {
  CameraView: any;
}
const ScanPluginContext = React.createContext<ScanPluginService>(null as any);

export const ScanPluginProvider = ScanPluginContext.Provider;
export const ScanPluginConsumer = ScanPluginContext.Consumer;
