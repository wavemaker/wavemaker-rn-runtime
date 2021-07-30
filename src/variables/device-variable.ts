import { BaseVariable, VariableConfig, VariableEvents } from '@wavemaker/app-rn-runtime/variables/base-variable';
import { CaptureImageOperation } from './device/camera/capture-image.operation';
import OperationProvider, { Input, Output } from './device/operation.provider';

export interface DeviceVariableConfig extends VariableConfig {
  service: string;
  operation: string;
}

export class DeviceVariable extends BaseVariable<DeviceVariableConfig> {

  constructor(config: DeviceVariableConfig) {
    super(config);
    this.dataSet = this.isList ? [] : {};
  }

  invoke(params: any, onSuccess?: Function, onError?: Function): Promise<DeviceVariable> {
    super.invoke(params, onSuccess, onError);
    const operation = OperationProvider.get(`${this.config.service}.${this.config.operation}`);
    if (!operation) {
      return Promise.resolve(this);
    }
    this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);

    return operation.invoke(params as Input, onSuccess, onError, this.config.operation)
      .then((data: Output) => {
        this.dataSet = data;
        this.config.onSuccess && this.config.onSuccess(this, this.dataSet);
        this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
      }, (err: Output) => {
        this.config.onError && this.config.onError(this, null);
        this.notify(VariableEvents.ERROR, [this, this.dataSet]);
      }).then(() => {
        this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
        return this;
    });
  }
}

export const initialize = ()=> {
  OperationProvider.set('camera.captureImage', new CaptureImageOperation());
};
