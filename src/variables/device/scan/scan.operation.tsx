import { ScanService } from "@wavemaker/app-rn-runtime/core/device/scan-service";
import { Operation, Input, Output } from '../operation.provider';

export interface ScanInput extends Input {
  barcodeFormat: string;
}

export interface ScanOutput extends Output {
  text : string;
  format : string;
  cancelled : boolean;
}

export class ScanOperation implements Operation {

  constructor(private scan: ScanService) {}

  public invoke(params: ScanInput): Promise<ScanOutput> {
    return this.scan.scanBarcode(params);
  }
}
