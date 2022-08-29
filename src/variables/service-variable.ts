import axios from "axios";
import { isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

import { BaseVariable, VariableConfig, VariableEvents } from './base-variable';
import { isObject, forEach, get, merge, includes, isEmpty, toUpper } from 'lodash';
import { WS_CONSTANTS } from './utils/variable.constants';
import { _setInput, isPageable } from './utils/variable.utils';
import { $queue } from './utils/inflight-queue';

export interface ServiceVariableConfig extends VariableConfig {
    serviceInfo: any;
    baseUrl: string;
    onCanUpdate: any;
    onBeforeUpdate: any;
    onResult: any;
    onBeforeDatasetReady: any;
    inFlightBehavior: string;
}

enum _ServiceVariableEvents {
    BEFORE_INVOKE = 'beforeInvoke'
}

export type ServiceVariableEvents = _ServiceVariableEvents | VariableEvents

export class ServiceVariable extends BaseVariable<VariableConfig> {
  private cancelTokenSource: any;

    constructor(config: ServiceVariableConfig) {
        super(config);
    }

    validateServiceInfo(config: ServiceVariableConfig) {
      const operationInfo = config.serviceInfo;
      // operationInfo is specifically null for un_authorized access
      if (operationInfo === null) {
        return {
          'error' : {
            'type': WS_CONSTANTS.REST_SERVICE.ERR_TYPE.USER_UNAUTHORISED,
            'message': WS_CONSTANTS.REST_SERVICE.ERR_MSG.USER_UNAUTHORISED,
            'field': '_wmServiceOperationInfo'
          }
        };
      } else if (isEmpty(operationInfo)) {
        return {
          'error' : {
            'type': WS_CONSTANTS.REST_SERVICE.ERR_TYPE.METADATA_MISSING,
            'message': WS_CONSTANTS.REST_SERVICE.ERR_MSG.METADATA_MISSING,
            'field': '_wmServiceOperationInfo'
          }
        };
      } else if (operationInfo && operationInfo.invalid) {
        return {
          'error' : {
            'type': WS_CONSTANTS.REST_SERVICE.ERR_TYPE.CRUD_OPERATION_MISSING,
            'message': WS_CONSTANTS.REST_SERVICE.ERR_MSG.CRUD_OPERATION_MISSING,
            'field': '_wmServiceOperationInfo'
          }
        };
      }
      return true;
    }

    invoke(options? : any, onSuccess?: Function, onError?: Function) {
      return $queue.submit(this).then(this._invoke.bind(this, options, onSuccess, onError));
    }

    async _invoke(options? : any, onSuccess?: Function, onError?: Function) {
        let params = options ? (options.inputFields ? options.inputFields : options) : undefined;
        if (!params) {
          const configParams = !isEmpty(this.params) ? this.params : this.config.paramProvider();
          params = Object.keys(configParams).length ? configParams : undefined;
        }
        await super.invoke(params, onSuccess, onError);
        const config = (this.config as ServiceVariableConfig);

        const validateInfo = this.validateServiceInfo(config);
        const errMsg = get(validateInfo, 'error.message');
        if (errMsg) {
          console.warn(errMsg);
          return Promise.reject(errMsg);
        }
        const onBeforeCallback = config.onBeforeUpdate && config.onBeforeUpdate(this, params);
        if (onBeforeCallback === false) {
          $queue.process(this);
          return;
        }
        if (onBeforeCallback) {
          params = onBeforeCallback;
        }
        const proxyURL = config.baseUrl;
        let queryParams = '',
          headers: any = {},
          requestBody: any,
          isProxyCall = isWebPreviewMode() ? get(config.serviceInfo, 'proxySettings.web') :  get(config.serviceInfo, 'proxySettings.mobile'),
          url = isProxyCall ? proxyURL + get(config.serviceInfo, 'relativePath') : (get(config.serviceInfo, 'directPath') || ''),
          requiredParamMissing: any = [],
          pathParamRex;

        forEach(config.serviceInfo.parameters, (param) => {
            let paramValue = this.params[param.name];
            if (param.parameterType.toUpperCase() === 'BODY') {
              paramValue = paramValue || {};
              var currentParamOutput = {}, temp: any = currentParamOutput;
              Object.keys(this.params).forEach((currentParam: any) => {
                if (currentParam.startsWith(param.name + '.')) {
                  const paramsList = currentParam.split('.');
                  paramsList.forEach((val:string, ind:number) => {
                     temp[val] = ind+1 === paramsList.length ? this.params[currentParam] : temp[val] || {};
                     temp = temp[val];
                  });
                  temp = currentParamOutput;
                  paramValue = currentParamOutput;
                 }
              });
              paramValue = paramValue[param.name] ? paramValue[param.name] : paramValue;
            }
            if (paramValue) {
              switch (param.parameterType.toUpperCase()) {
                  case 'QUERY':
                      if (!queryParams) {
                          queryParams = '?' + param.name + '=' + encodeURIComponent(paramValue);
                      } else {
                          queryParams += '&' + param.name + '=' + encodeURIComponent(paramValue);
                      }
                      break;
                    case 'PATH':
                      /* replacing the path param based on the regular expression in the relative path */
                      pathParamRex = new RegExp('\\s*\\{\\s*' + param.name + '(:\\.\\+)?\\s*\\}\\s*');
                      url = url.replace(pathParamRex, paramValue);
                      break;
                    case 'HEADER':
                      // @ts-ignore
                      headers[param.name] = paramValue;
                      break;
                    case 'BODY':
                      requestBody = paramValue;
                      break;
                    case 'FORMDATA':
                      break;
                  }
            } else if (param.required) {
              requiredParamMissing.push(param.name || param.id);
            }
        });

        if (requiredParamMissing.length) {
          console.error({
              'error': {
                'type': 'Required field(s) missing',
                  'field': requiredParamMissing.join(',')
              }
          });
          $queue.process(this);
          return Promise.reject('Required field(s) missing');
        }

        // Setting appropriate content-Type for request accepting request body like POST, PUT, etc
        if (!includes(WS_CONSTANTS.NON_BODY_HTTP_METHODS, toUpper(config.serviceInfo.methodType))) {
          /*Based on the formData browser will automatically set the content type to 'multipart/form-data' and webkit boundary*/
          if ((config.serviceInfo.consumes && (config.serviceInfo.consumes[0] === WS_CONSTANTS.CONTENT_TYPES.MULTIPART_FORMDATA))) {
            let formData = new FormData();
            forEach(this.params, (v, k) => {
              formData.append(k, v);
            });
            requestBody = formData;
          }
          headers['Content-Type'] = (config.serviceInfo.consumes && config.serviceInfo.consumes[0]) || 'application/json';
        }

        // if the consumes has application/x-www-form-urlencoded and
        // if the http request of given method type can have body send the queryParams as Form Data
        if (includes(config.serviceInfo.consumes, WS_CONSTANTS.CONTENT_TYPES.FORM_URL_ENCODED) && !includes(WS_CONSTANTS.NON_BODY_HTTP_METHODS, (config.serviceInfo.methodType || '').toUpperCase())) {
          // remove the '?' at the start of the queryParams
          if (queryParams) {
            requestBody = (requestBody ? requestBody + '&' : '') + queryParams.substring(1);
          }
          headers['Content-Type'] = WS_CONSTANTS.CONTENT_TYPES.FORM_URL_ENCODED;
        } else {
          url += queryParams;
        }

        this.params = this.config.paramProvider();
        this.notify(VariableEvents.BEFORE_INVOKE, [this, this.dataSet]);
        // to cancel variable xhr calls
        this.cancelTokenSource = axios.CancelToken.source();
        const methodType = config.serviceInfo.methodType;
        const isNonDataMethod = WS_CONSTANTS.NON_DATA_AXIOS_METHODS.indexOf(methodType.toUpperCase()) > -1;
        const axiosConfig = {
          headers: headers,
          cancelToken: this.cancelTokenSource.token,
          withCredentials: config.serviceInfo.proxySettings?.mobile ||  config.serviceInfo.proxySettings?.withCredentials
        };
        // @ts-ignore
        return axios[methodType].apply(this, ( isNonDataMethod ? [url, axiosConfig] : [url, requestBody || {}, axiosConfig]))
          .then((result: any) => {
          config.onResult && config.onResult(this, result.data, result);
          const isResponsePageable = isPageable(result.data);
          let response = result.data;
          if (isResponsePageable) {
            response = get(result.data, 'content', result.data);
          }
          this.dataSet = (!isObject(result.data)) ? {'value': result.data} : response;
          if (isResponsePageable) {
            Object.defineProperty(this.dataSet, 'content', {
              get: () => {
                return this.dataSet;
              }
            });
          }
          // EVENT: ON_PREPARE_SETDATA
          const newDataSet = config.onBeforeDatasetReady && config.onBeforeDatasetReady(this, this.dataSet);
          if (newDataSet) {
            // setting returned value to the dataSet
            this.dataSet = newDataSet;
          }
        }).then(() => {
          config.onSuccess && config.onSuccess(this, this.dataSet);
          onSuccess && onSuccess(this.dataSet);
          this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
          return this.dataSet;
        }, (error: any) => {
          config.onError && config.onError(this, error);
          onError && onError(error);
          this.notify(VariableEvents.ERROR, [this, this.dataSet]);
          return error;
        }).then((res: any) => {
          this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
          $queue.process(this);
          config.onCanUpdate && config.onCanUpdate(this, res);
          return this;
        });
    }

    cancel($file?: any) {
      // CHecks if there is any pending requests in the queue
      if ($queue.requestsQueue.has(this)) {
        // If the request is a File upload request then modify the elements associated with file upload
        // else unsubscribe from the observable on the variable.
        if (false) {
          // $file._uploadProgress.unsubscribe();
          // $file.status = 'abort';
          // this.totalFilesCount--;
          // initiateCallback(VARIABLE_CONSTANTS.EVENT.ABORT, variable, $file);
          // if (!this.isFileUploadInProgress(variable.dataBinding) && this.totalFilesCount === 0) {
          //   $queue.process(variable);
          //   // notify inflight variable
          //   this.notifyInflight(variable, false);
          // }
        } else {
          if (true) {
            this.cancelTokenSource.cancel();
            $queue.process(this);
            // notify inflight variable
            //this.notifyInflight(variable, false);
          }
        }
      }
    }

    setInput(key: any, val?: any, options?: any) {
      this.params = merge({}, this.config.paramProvider(), _setInput(this.params, key, val, options));
      return this.params;
    }
}
