import DatasetUtil from './utils/dataset-util';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';
import { ROOT_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import { isNumber, isObject, isBoolean, get, isEqual } from 'lodash';
export interface VariableConfig {
    name: string;
    paramProvider: Function;
    onBefore: Function;
    onComplete: Function;
    onSuccess: Function;
    onError: Function;
    onBeforeUpdate: Function,
    isList: boolean;
    twoWayBinding: boolean;
    service: any;
    operation: string;
    operationId: string;
    operationType: string;
    serviceType: string;
}

export enum VariableEvents {
  BEFORE_INVOKE = 'beforeInvoke',
  SUCCESS = 'success',
  ERROR = 'error',
  AFTER_INVOKE = 'afterInvoke'
};

export const VARIABLE_LOGGER = ROOT_LOGGER.extend('variable');

export abstract class BaseVariable<T extends VariableConfig> extends EventNotifier {
    name: string = '';
    params: any = {};
    dataSet: any = {};
    isList: boolean;
    twoWayBinding: boolean;
    isExecuting = false;

    constructor(public config: T) {
      super();
      this.name = config.name;
      this.isList = config.isList;
      this.twoWayBinding = config.twoWayBinding;
      this.dataSet = this.isList ? []: this.dataSet;
      this.subscribe(VariableEvents.BEFORE_INVOKE, () => {
        this.isExecuting = true;
        VARIABLE_LOGGER.info(`Before Invoking variable ${this.name}`);
      });
      this.subscribe(VariableEvents.AFTER_INVOKE, () => {
        this.isExecuting = false;
        VARIABLE_LOGGER.info(`After Invoking variable ${this.name}`);
      });
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<BaseVariable<T>> {
        if (!params) {
            this.params = this.config.paramProvider();
        } else {
            this.params = params;
        }
        return Promise.resolve(this);
    }

    public doNext(): Promise<BaseVariable<T>> {
      return Promise.reject(this);
    }

    public invokeOnParamChange(): Promise<BaseVariable<T>> {
        const last = this.params;
        const latest = this.config.paramProvider();
        if (!isEqual(last, latest)) {
            return this.invoke(latest);
        }
        return Promise.resolve(this);
    }

    public getData() {
        return this.dataSet;
    }

    public setData(dataSet: any) {
      if (DatasetUtil.isValidDataset(dataSet, this.isList)) {
        this.dataSet = dataSet;
      }
      return this.dataSet;
    }

    getValue(key: string, index: number) {
      return DatasetUtil.getValue(this.dataSet, key, index, this.isList);
    }

    setValue(key: string, value: any) {
      return DatasetUtil.setValue(this.dataSet, key, value, this.isList);
    }

    getItem(index: number) {
      return DatasetUtil.getItem(this.dataSet, index, this.isList);
    }

    setItem(index: any, value: any, options?: any) {
      options = DatasetUtil.getChildDetails(this.dataSet, options, this.isList);
      return DatasetUtil.setItem(this.dataSet, index, value, options);
    }

    addItem(value: any, options?: any) {
      let index;
      if (isNumber(options)) {
        index = options;
      }
      if (isObject(options)) {
        // @ts-ignore
        index = options.index;
      }

      options = DatasetUtil.getChildDetails(this.dataSet, options, this.isList);
      return DatasetUtil.addItem(this.dataSet, value, index, options);
    }

    removeItem(index: any, options?: any) {
      let exactMatch, parentIndex;
      if (options) {
        if (isBoolean(options)) {
          exactMatch = options;
        }
        if (isObject(options)) {
          // @ts-ignore
          exactMatch = options.exactMatch;
          if (this.isList) {
            // @ts-ignore
            parentIndex = options.parentIndex || 0;
          }
        }
      }
      return DatasetUtil.removeItem(this.dataSet, index, { exactMatch, path: get(options, 'path'), parentIndex });
    }

    clearData() {
      this.dataSet = DatasetUtil.getValidDataset(this.isList);
      return this.dataSet;
    }

    getCount() {
      return DatasetUtil.getCount(this.dataSet, this.isList);
    }

    pause() {}

    resume() {}

    destroy() {}

}
