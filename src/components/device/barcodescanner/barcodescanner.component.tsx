import React from 'react';
import { View } from 'react-native';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import { ScanInput, ScanOutput } from '@wavemaker/app-rn-runtime/variables/device/scan/scan.operation';
import { ScanConsumer, ScanPluginConsumer, ScanPluginService, ScanService } from '@wavemaker/app-rn-runtime/core/device/scan-service';

import WmBarcodescannerProps from './barcodescanner.props';
import { DEFAULT_CLASS, WmBarcodescannerStyles } from './barcodescanner.styles';
import WmButton from '@wavemaker/app-rn-runtime/components/basic/button/button.component';
import { PermissionConsumer, PermissionService } from '@wavemaker/app-rn-runtime/runtime/services/device/permission-service';

export class WmBarcodescannerState extends BaseComponentState<WmBarcodescannerProps> {}

export default class WmBarcodescanner extends BaseComponent<WmBarcodescannerProps, WmBarcodescannerState, WmBarcodescannerStyles> {
  private scanPluginService: ScanPluginService = null as any;
  private permissionService: PermissionService = null as any;
  private scanner: ScanService = null as any;
  constructor(props: WmBarcodescannerProps) {
    super(props, DEFAULT_CLASS, new WmBarcodescannerProps());
  }

  onScanTap() {
    const params: ScanInput = {
      barcodeFormat: this.state.props.barcodeformat,
      scanPluginService: this.scanPluginService,
      permissionService: this.permissionService
    };
    this.scanner.scanBarcode(params).then((res: ScanOutput) => {
      this.updateState({
        props: {
          datavalue: res.text
        }
      } as WmBarcodescannerState, () => {
        this.invokeEventCallback('onSuccess', [null, this.proxy]);
      });
    })
  }

  renderWidget(props: WmBarcodescannerProps) {
    const accessibilityProps = {
      accessible: props.accessible, 
      accessibilitylabel: props.accessibilitylabel || props.caption,
      accessibilityrole: props.accessibilityrole,
      hint: props.hint,
    }
    return (
      <PermissionConsumer>
      {(permissionService: PermissionService) => {
        this.permissionService = permissionService;
        return (<ScanPluginConsumer>
        {(scanPluginService: any) => {
          this.scanPluginService = scanPluginService;  
          return <ScanConsumer>
          {(scanService: ScanService) => {
           this.scanner = scanService;
           return <View style={this.styles.root} onLayout={(event) => this.handleLayout(event)}>
             {this._background}
             <WmButton id={this.getTestId('button')} iconclass={props.iconclass} styles={this.styles.button} onTap={this.onScanTap.bind(this)} caption={props.caption} iconsize={props.iconsize} {...accessibilityProps}></WmButton>
           </View>
            }}
          </ScanConsumer>
        }}
        </ScanPluginConsumer>)
      }}
      </PermissionConsumer>
    );
  }
}
