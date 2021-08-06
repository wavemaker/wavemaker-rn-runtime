import axios from "axios";
import { BaseVariable, VariableConfig, VariableEvents } from "./base-variable";
import { isObject, isNumber, forEach, get, isArray, toLower, merge, includes, toUpper } from "lodash";
import AppConfig from "@wavemaker/app-rn-runtime/core/AppConfig";
import { WS_CONSTANTS } from "./utils/variable.constants";
import {_setInput} from "./utils/variable.utils";
import {$queue} from "./utils/inflight-queue";

export interface ServiceVariableConfig extends VariableConfig {
    serviceInfo: any;
    appConfig: AppConfig;
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

    invoke(options? : any) {
      super.invoke();
      return $queue.submit(this).then(this._invoke.bind(this, options));
    }

    _invoke(options? : any) {
        let params = options ? (options.inputFields ? options.inputFields : options) : undefined;
        if (!params) {
          params = Object.keys(this.params).length ? this.params : undefined;
        }
        const config = (this.config as ServiceVariableConfig);

        const onBeforeCallback = config.onBeforeUpdate && config.onBeforeUpdate(this, params);
        if (onBeforeCallback === false) {
          $queue.process(this);
          return;
        }
        if (onBeforeCallback) {
          params = onBeforeCallback;
        }
        super.invoke(params);
        const proxyURL = config.appConfig?.url ? config.appConfig?.url + '/services' : '';
        let queryParams = '',
          headers: any = {},
          requestBody,
          url = get(config.serviceInfo, 'proxySettings.mobile') === true ? proxyURL + config.serviceInfo.relativePath : config.serviceInfo.directPath,
          requiredParamMissing: any = [],
          pathParamRex;

        forEach(config.serviceInfo.parameters, (param) => {
            let paramValue = this.params[param.name];
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
          return Promise.reject('Required field(s) missing');
        }

        // Setting appropriate content-Type for request accepting request body like POST, PUT, etc
        if (!includes(WS_CONSTANTS.NON_BODY_HTTP_METHODS, toUpper(config.serviceInfo.methodType))) {
          /*Based on the formData browser will automatically set the content type to 'multipart/form-data' and webkit boundary*/
          if (!(config.serviceInfo.methodType.consumes && (config.serviceInfo.methodType.consumes[0] === WS_CONSTANTS.CONTENT_TYPES.MULTIPART_FORMDATA))) {
            headers['Content-Type'] = (config.serviceInfo.methodType.consumes && config.serviceInfo.methodType.consumes[0]) || 'application/json';
          }
        }

        // if the consumes has application/x-www-form-urlencoded and
        // if the http request of given method type can have body send the queryParams as Form Data
        if (includes(config.serviceInfo.methodType.consumes, WS_CONSTANTS.CONTENT_TYPES.FORM_URL_ENCODED) && !includes(WS_CONSTANTS.NON_BODY_HTTP_METHODS, (config.serviceInfo.methodType || '').toUpperCase())) {
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
        // @ts-ignore
        return axios[config.serviceInfo.methodType].apply(this, (WS_CONSTANTS.NON_DATA_AXIOS_METHODS.indexOf(config.serviceInfo.methodType.toUpperCase()) > -1 ? [url, {headers: headers, cancelToken: this.cancelTokenSource.token}] : [url, requestBody, {headers: headers, cancelToken: this.cancelTokenSource.token}])).then(result => {
          config.onResult && config.onResult(this, result.data, result);
          this.dataSet = (!isObject(result.data)) ? {'value': result.data} : result.data;
          // EVENT: ON_PREPARE_SETDATA
          const newDataSet = config.onBeforeDatasetReady && config.onBeforeDatasetReady(this, this.dataSet);
          if (newDataSet) {
            // setting returned value to the dataSet
            this.dataSet = newDataSet;
          }
        }).then(() => {
          config.onSuccess && config.onSuccess(this, this.dataSet);
          this.notify(VariableEvents.SUCCESS, [this, this.dataSet]);
        }, () => {
          config.onError && config.onError(this, null);
          this.notify(VariableEvents.ERROR, [this, this.dataSet]);
        }).then(() => {
          this.notify(VariableEvents.AFTER_INVOKE, [this, this.dataSet]);
          $queue.process(this);
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
