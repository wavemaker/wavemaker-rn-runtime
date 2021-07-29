import { BaseVariable, VariableConfig, VariableEvents } from '@wavemaker/app-rn-runtime/variables/base-variable';
import deviceServiceInit  from '@wavemaker/app-rn-runtime/variables/device/device-service-init';

export interface Input {
}

export interface Output {
}

export interface DeviceVariableConfig extends VariableConfig {
  service: string;
  operation: string;
}

export interface IDeviceVariableOperation {
  name: string;
  invoke(params?: {}, onSuccess?: Function, onError?: Function, operation?: string): Promise<Input>;
}

export class DeviceVariable extends BaseVariable {
  name: string = '';
  config: DeviceVariableConfig;

  constructor(config: DeviceVariableConfig) {
    super(config);
    this.dataSet = this.isList ? [] : {};
    this.config = config;
  }

  invoke(params: Input, onSuccess?: Function, onError?: Function): Promise<DeviceVariable> {
    const selectedService = deviceServiceInit.get().serviceRegistry.get(this.config.service);

    if (!params) {
      params = this.config.paramProvider();
    }

    if (!selectedService) {
      return Promise.resolve(this as DeviceVariable);
    }
    this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);

    return selectedService.invoke(params, onSuccess, onError, this.config.operation)
      .then((data: Output) => {
        this.dataSet = data;
        this.config.onSuccess && this.config.onSuccess(this, this.dataSet);
        this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
      }, (err: Output) => {
        this.config.onError && this.config.onError(this, null);
        this.notify(VariableEvents.ERROR, [this, this.dataSet]);
      }).then(() => {
        this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
        return this as DeviceVariable;
    });
  }
}
