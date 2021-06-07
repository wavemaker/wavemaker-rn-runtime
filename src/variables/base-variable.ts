import DatasetUtil from './utils/dataset-util';
import { isNumber, isObject, isBoolean, get, isEqual } from 'lodash';
export interface VariableConfig {
    paramProvider: Function;
    onSuccess: Function;
    onError: Function;
    isList: boolean;
}

export abstract class BaseVariable {
    params: any = {};
    dataSet: any = {};
    isList: boolean;

    constructor(public config: VariableConfig) {
      this.isList = config.isList;
    }

    public invoke(params?: {}, onSuccess?: Function, onError?: Function): Promise<BaseVariable> {
        if (!params) {
            this.params = this.config.paramProvider();
        } else {
            this.params = params;
        }
        return Promise.resolve(this);
    }

    public invokeOnParamChange(): Promise<BaseVariable> {
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

}
