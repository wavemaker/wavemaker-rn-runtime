import React from 'react';
import { ScanPluginConsumer, ScanPluginService, ScanService } from "@wavemaker/app-rn-runtime/core/device/scan-service";
import { Operation, Input, Output } from '../operation.provider';
import { PermissionConsumer, PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

export interface ScanInput extends Input {
  barcodeFormat: string;
  scanPluginService: any;
  permissionService: any;
}

export interface ScanOutput extends Output {
  text : string;
  format : string;
  cancelled : boolean;
}

export class ScanOperation implements Operation {

  constructor(private scan: ScanService) {}

  public invoke(params: ScanInput): any {
    return (
      <PermissionConsumer>
        {(permissionService: PermissionService) => {
          return (
            <ScanPluginConsumer>
              {(scanPluginService: ScanPluginService) => {
                return this.scan.scanBarcode({ ...params, scanPluginService, permissionService });
              }}
            </ScanPluginConsumer>
          );
        }}
      </PermissionConsumer>
    );
  }
}
