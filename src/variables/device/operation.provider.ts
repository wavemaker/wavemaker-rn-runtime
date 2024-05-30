import { DeviceVariable } from "../device-variable";

export interface Operation {
  invoke(params?: Input, onSuccess?: Function, onError?: Function, operation?: string, variable?: DeviceVariable): Promise<Output>;
}

export interface Input {
}

export interface Output {
}

const registry = new Map<string, Operation>();

export class OperationProvider {

  public set(name: string, operation: Operation) {
    return registry.set(name, operation);
  }

  public get(name: string) {
    return registry.get(name);
  }
}

export default new OperationProvider();