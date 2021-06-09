import axios from "axios";
import { BaseVariable, VariableConfig } from "./base-variable";
import { isObject, isNumber, forEach, get } from "lodash";

export interface ServiceVariableConfig extends VariableConfig {
    serviceInfo: any;
}

export class ServiceVariable extends BaseVariable {

    constructor(config: ServiceVariableConfig) {
        super(config);
        // @ts-ignore
        this.dataSet = config.dataSet;
    }

    invoke(options? : any) {
        let params = options ? (options.inputFields ? options.inputFields : options) : undefined;
        if (!params) {
          params = Object.keys(this.params).length ? this.params : undefined;
        }
        super.invoke(params);
        const config = (this.config as ServiceVariableConfig);
        const queryParams = config.serviceInfo.parameters
            .filter((p:any) => p.parameterType === 'query')
            .map((p: any) => {
                return `${p.name}=${this.params[p.name]}`
            }).join('&');
        this.params = this.config.paramProvider();
        return axios.get(config.serviceInfo.directPath + '?'+ queryParams).then(result => {
            this.dataSet = result.data;
        }).then(() => {
            config.onSuccess && config.onSuccess(this, this.dataSet);
            return this;
        }, () => {
            config.onError && config.onError(this, null);
            return this;
        });
    }

    setInput(key: any, val?: any, options?: any) {
      this.params = this._setInput(this.params, key, val, options);
      return this.params;
    }

    /**
     * sets the value against passed key on the "inputFields" object in the variable
     * @param targetObj: the object in which the key, value is to be set
     * @param variable
     * @param key: can be:
     *  - a string e.g. "username"
     *  - an object, e.g. {"username": "john", "ssn": "11111"}
     * @param val
     * - if key is string, the value against it (for that data type)
     * - if key is object, not required
     * @param options
     * @returns {any}
     */
    private _setInput(targetObj: any, key: any, val: any, options?: any) {
      targetObj = targetObj || {};
      let keys,
        lastKey,
        paramObj: any = {};

      // content type check
      if (isObject(options)) {
        // @ts-ignore
        switch (options.type) {
          case 'file':
            //val = getBlob(val, options.contentType);
            break;
          case 'number':
            val = isNumber(val) ? val : parseInt(val, 10);
            break;
        }
      }

      if (isObject(key)) {
        // check if the passed parameter is an object itself
        paramObj = key;
      } else if (key.indexOf('.') > -1) {
        // check for '.' in key e.g. 'employee.department'
        keys = key.split('.');
        lastKey = keys.pop();
        // Finding the object based on the key
        targetObj = this.findValueOf(targetObj, keys.join('.'), true);
        key = lastKey;
        paramObj[key] = val;
      } else {
        paramObj[key] = val;
      }

      forEach(paramObj, function (paramVal, paramKey) {
        targetObj[paramKey] = paramVal;
      });
      return targetObj;
    }

    /*
  * Util method to find the value of a key in the object
  * if key not found and create is true, an object is created against that node
  * Examples:
  * var a = {
  *  b: {
  *      c : {
  *          d: 'test'
  *      }
  *  }
  * }
  * Utils.findValue(a, 'b.c.d') --> 'test'
  * Utils.findValue(a, 'b.c') --> {d: 'test'}
  * Utils.findValue(a, 'e') --> undefined
  * Utils.findValue(a, 'e', true) --> {} and a will become:
  * {
  *   b: {
  *      c : {
  *          d: 'test'
  *      }
  *  },
  *  e: {
  *  }
  * }
  */
    private findValueOf(obj: any, key: any, create?: any) {

      if (!obj || !key) {
        return;
      }

      if (!create) {
        return get(obj, key);
      }

      const parts = key.split('.'),
        keys: any = [];

      let skipProcessing;

      // @ts-ignore
      parts.forEach((part: any) => {
        if (!parts.length) { // if the part of a key is not valid, skip the processing.
          skipProcessing = true;
          return false;
        }

        const subParts = part.match(/\w+/g);
        let subPart;

        while (subParts.length) {
          subPart = subParts.shift();
          keys.push({ 'key': subPart, 'value': subParts.length ? [] : {} }); // determine whether to create an array or an object
        }
      });

      if (skipProcessing) {
        return undefined;
      }

      keys.forEach((_key: any) => {
        let tempObj = obj[_key.key];
        if (!isObject(tempObj)) {
          tempObj = this.getValidJSON(tempObj);
          if (!tempObj) {
            tempObj = _key.value;
          }
        }
        obj[_key.key] = tempObj;
        obj = tempObj;
      });

      return obj;
    };

    private getValidJSON(content: any) {
      if (!content) {
        return undefined;
      }
      try {
        const parsedIntValue = parseInt(content, 10);
        /*obtaining json from editor content string*/
        return isObject(content) || !isNaN(parsedIntValue) ? content : JSON.parse(content);
      } catch (e) {
        /*terminating execution if new variable object is not valid json.*/
        return undefined;
      }
    }
}
