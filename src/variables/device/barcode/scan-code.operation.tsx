import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {DisplayManager} from '@wavemaker/app-rn-runtime/core/display.manager';
import {Operation, Input, Output} from '../operation.provider';


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

export interface ScanInput extends Input {
  barcodeFormat: string;
}

export interface ScanOutput extends Output {
  text : string;
  format : string;
  cancelled : boolean;
}

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

export class ScanOperation implements Operation {
  private displayManager: DisplayManager;

  constructor(displayManager: DisplayManager) {
    this.displayManager = displayManager;
  }

  public invoke(params: ScanInput): Promise<ScanOutput> {
    const barcodeFormat: string = barcodeFormatOptions[params.barcodeFormat];
    return new Promise((resolve, reject) => {
      const destroy = this.displayManager.show({
        content: (<Camera
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType[barcodeFormat]],
          }}
          onBarCodeScanned={(result) => { destroy.call(this.displayManager); resolve(result);}}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.topWrapper} />
          <View style={styles.centerWrapper}>
            <View style={styles.leftWrapper} />
            <View style={styles.focused} />
            <View style={styles.rightWrapper} />
          </View>
          <View style={styles.bottomWrapper} />
        </Camera>)
      });
    }).then((response: any) => {
        let format;
        if (response.type) {
          format = BarCodeScanner.Constants.BarCodeType.find((k: string, v: string) => {
            return v === response.type && k;
          })
        }
        return Promise.resolve({
          text: response.data,
          format : format || response.type,
          cancelled : false
        });
      });
    }
}
