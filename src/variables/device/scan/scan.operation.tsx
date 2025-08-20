import { ScanPluginService, ScanService } from "@wavemaker/app-rn-runtime/core/device/scan-service";
import { Operation, Input, Output } from '../operation.provider';
import { PermissionService } from "@wavemaker/app-rn-runtime/runtime/services/device/permission-service";

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

  constructor(private scan: ScanService, private permissionService: PermissionService, private scanPluginService: ScanPluginService) {}

  public invoke(params: ScanInput): any {
    return this.scan.scanBarcode({ ...params, scanPluginService: this.scanPluginService, permissionService: this.permissionService });
  }
}
