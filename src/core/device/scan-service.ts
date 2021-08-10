import {ScanInput} from "@wavemaker/app-rn-runtime/variables/device/scan/scan.operation";

export interface ScanService {
  scanBarcode: (params: ScanInput) => any;
}
