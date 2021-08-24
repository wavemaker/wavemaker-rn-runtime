import {Camera} from "expo-camera";
import {BarCodeScanner} from "expo-barcode-scanner";
import {Platform, StyleSheet, View} from "react-native";
import React from "react";
import { ScanInput, ScanOutput } from "@wavemaker/app-rn-runtime/variables/device/scan/scan.operation";
import {DisplayManager} from "@wavemaker/app-rn-runtime/core/display.manager";
import permissionManager from "@wavemaker/app-rn-runtime/runtime/services/device/permissions";

interface objectMap {
  [key: string]: string
}

const barcodeFormatOptions: objectMap = {
  'ALL': 'ALL',
  'CODABAR': 'codabar',
  'CODE_39': 'code39',
  'CODE_93': 'code93',
  'CODE_128': 'code128',
  'DATA_MATRIX': 'datamatrix',
  'EAN_8': 'ean8',
  'EAN_13': 'ean13',
  'ITF': 'itf14',
  'PDF_417': 'pdf417',
  'QR_CODE': 'qr',
  'RSS14': 'rss14',
  'RSS_EXPANDED': 'rssexpanded',
  'UPC_E': 'upc_e',
  'UPC_A': 'upc_a'
};
const opacity = 'rgba(0, 0, 0, 0.6)';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  topWrapper: {
    flex: 2,
    backgroundColor: opacity
  },
  centerWrapper: {
    flex: 2,
    flexDirection: 'row'
  },
  leftWrapper: {
    flex: 2,
    backgroundColor: opacity
  },
  focused: {
    flex: 10
  },
  rightWrapper: {
    flex: 2,
    backgroundColor: opacity
  },
  bottomWrapper: {
    flex: 2,
    backgroundColor: opacity
  },
});

export class ScanService {

  constructor(private displayManager: DisplayManager) {}

  public scanBarcode(params: ScanInput): Promise<ScanOutput> {
    const format = Platform.OS === 'ios' ? params.barcodeFormat : 'QR_CODE';
    const barcodeFormat: string = barcodeFormatOptions[format];
    return new Promise((resolve, reject) => {
      permissionManager.requestPermissions('camera').then(() => {
        const destroy = this.displayManager.show({
          content: (<Camera
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType[barcodeFormat]],
            }}
            onBarCodeScanned={(result) => {
              destroy.call(this.displayManager);
              resolve(result);
            }}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={styles.topWrapper}/>
            <View style={styles.centerWrapper}>
              <View style={styles.leftWrapper}/>
              <View style={styles.focused}/>
              <View style={styles.rightWrapper}/>
            </View>
            <View style={styles.bottomWrapper}/>
          </Camera>)
        });
      }, reject)
    }).then((response: any) => {
      let format;
      if (response.type) {
        const values = Object.values(BarCodeScanner.Constants.BarCodeType);
        const index = values.indexOf(response.type);
        format = index > -1 ? Object.keys(BarCodeScanner.Constants.BarCodeType)[index] : '';
      }
      return Promise.resolve({
        text: response.data,
        format : format || response.type,
        cancelled : false
      });
    });
  }
}
