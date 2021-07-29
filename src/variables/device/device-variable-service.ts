import { IDeviceVariableOperation, Input, Output} from "@wavemaker/app-rn-runtime/variables/device-variable";

export class DeviceVariableService {
  public serviceRegistry: Map<string, IDeviceVariableOperation> = new Map<string, IDeviceVariableOperation>();
  public readonly operations: IDeviceVariableOperation[] = [];

  public registerService(service: IDeviceVariableOperation) {
    this.serviceRegistry.set(service.name, service);
  }
  invoke(params: Input, onSuccess?: Function, onError?: Function, operation?: string): Promise<Output> {
    const selectedOperation = this.operations.find(o => {
      return o.name === operation;
    });

    if (!selectedOperation) {
      return Promise.resolve({});
    }

    return selectedOperation.invoke(params, onSuccess, onError).then(data => {
      onSuccess && onSuccess(this, data);
      return data as Output;
    }, err => {
      onError && onError(this, err);
      return {};
    });
  }
}
