import { VariableConfig, VariableEvents } from './base-variable';
import { isEqual, assignIn, isString } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { ServiceVariable as _ServiceVariable } from '@wavemaker/variables/src/model/variable/service-variable';
import httpService from '@wavemaker/app-rn-runtime/variables/http.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { interceptService } from '@wavemaker/variables/src/interceptor';
import { ServiceVariableContext } from './interceptor/intercept-context.impl';
import { addPassThroughInterceptor, addServiceVariableInterceptor } from './interceptor/interceptor.factory';

export interface ServiceVariableConfig extends VariableConfig {
  baseUrl: string;
  maxResults: number;
  _context: any;
  serviceType: string;
  onCanUpdate: any;
  onBeforeUpdate: any;
  onResult: any;
  onBeforeDatasetReady: any;
  inFlightBehavior: string;
  controller: string;
  getServiceInfo: Function;
}

enum _ServiceVariableEvents {
  BEFORE_INVOKE = 'beforeInvoke'
}
export type ServiceVariableEvents = _ServiceVariableEvents | VariableEvents;

export class ServiceVariable extends _ServiceVariable {
  params: any = {};
  public appConfig = injector.get<AppConfig>('APP_CONFIG');

  constructor(public config: ServiceVariableConfig) {
    let variableConfig: any = {
      name: config.name,
      dataSet: config.paramProvider(),
      dataBinding: {},
      isList: config.isList,
      service: config.service,
      serviceType: config.serviceType,
      maxResults: config.maxResults,
      _context: config._context,
      operation: config.operation,
      operationId: config.operationId,
      operationType: config.operationType,
      controller: config.controller,
      serviceInfo: config.getServiceInfo(),
      httpClientService: httpService,
      inFlightBehavior: config.inFlightBehavior,
      onSuccess: (context: any, args: any) => {
        this.notify(VariableEvents.AFTER_INVOKE, [args.variable, args.data, args.options]);
        this.notify(VariableEvents.SUCCESS, [args.variable, args.data, args.options]);
        return config.onSuccess && config.onSuccess(args.variable, args.data, args.options);
      },
      onError: (context: any, args: any) => {
        this.notify(VariableEvents.AFTER_INVOKE, [args.variable, args.data, args.options]);
        this.notify(VariableEvents.ERROR, [args.variable, args.data, args.options]);
        return config.onError && config.onError(args.variable, args.data, args.options);
      },
      onCanUpdate: (context: any, args: any) => {
        return config.onCanUpdate && config.onCanUpdate(args.variable, args.data, args.options);
      },
      onBeforeUpdate: (context: any, args: any) => {
        this.notify(VariableEvents.BEFORE_INVOKE, [args.variable, args.inputData, args.options]);
        return config.onBeforeUpdate && config.onBeforeUpdate(args.variable, args.inputData, args.options);
      },
      onResult: (context: any, args: any) => {
        return config.onResult && config.onResult(args.variable, args.data, args.options);
      },
      onBeforeDatasetReady: (context: any, args: any) => {
        return config.onBeforeDatasetReady && config.onBeforeDatasetReady(args.variable, args.data, args.options);
      }
    }
    if (config.onError) {
      variableConfig.onError = (context: any, args: any) => {
        return config.onError && config.onError(args.variable, args.data, args.options);
      };
    }
    super(variableConfig);
    this.subscribe(VariableEvents.AFTER_INVOKE, () => {
        this.dataBinding = {};
    });
    this.init();
  }

  invokeOnParamChange() {
    const last = this.params;
    const latest = this.config.paramProvider();
    if (!isEqual(last, latest)) {
      this.invoke(latest);
    }
    return Promise.resolve(this);
  }

  public async doNext() {
    let page = 0 as any;
    if (isString(this.pagination.page)) {
      page = (parseInt(this.pagination.page) + 1) + '';
    } else {
      page = this.pagination.page + 1;
    }
    return new Promise((resolve, reject) => {
      this.invoke({
        page: page
      },
      (dataset: any) => resolve(dataset),
      reject);
    });
  }

  onDataUpdated() {
    this.appConfig.refresh(false);
  }

  invoke(options? : any, onSuccess?: Function, onError?: Function) {
    this.params = this.config.paramProvider();
    this.params = deepCopy({} as any, this.params, this.dataBinding);
    if (options) {
      this.params = deepCopy({} as any, this.params, options.inputFields ? options.inputFields : options);
    }
    options = options || {};
    options.inputFields = this.params;
      // service definitions data depends on whether user logged in or not
    // Try to get the latest definition
    this.serviceInfo = this.config.getServiceInfo();
    if (this.serviceInfo?.httpMethod?.toUpperCase() === 'GET') {
      const url = this.serviceInfo.directPath || this.serviceInfo.relativePath;
      addPassThroughInterceptor({
        url: url,
        cache: {
          timeout: 5 * 60 * 1000
        }
      });
    }
    if (!this.serviceInfo) {
      console.error(`Service Info is missing for (${this.name}) variable.`)
    }
    return super.invoke(options, onSuccess, onError);
  }

  // cancel($file?: any) {
  //   // CHecks if there is any pending requests in the queue
  //   if ($queue.requestsQueue.has(this)) {
  //     // If the request is a File upload request then modify the elements associated with file upload
  //     // else unsubscribe from the observable on the variable.
  //     if (false) {
  //       // $file._uploadProgress.unsubscribe();
  //       // $file.status = 'abort';
  //       // this.totalFilesCount--;
  //       // initiateCallback(VARIABLE_CONSTANTS.EVENT.ABORT, variable, $file);
  //       // if (!this.isFileUploadInProgress(variable.dataBinding) && this.totalFilesCount === 0) {
  //       //   $queue.process(variable);
  //       //   // notify inflight variable
  //       //   this.notifyInflight(variable, false);
  //       // }
  //     } else {
  //       if (true) {
  //         this.cancelTokenSource.cancel();
  //         $queue.process(this);
  //         // notify inflight variable
  //         //this.notifyInflight(variable, false);
  //       }
  //     }
  //   }
  // }

  // setInput(key: any, val?: any, options?: any) {
  //   this.params = merge({}, this.config.paramProvider(), _setInput(this.params, key, val, options));
  //    return this.params;
  // }

  private generateStr(o: any) {
    if (typeof o === 'string' || typeof o !== 'object' ) {
      return JSON.stringify(o);
    }
    let str = '';
    Object.keys(o || {}).sort().forEach((key, i) => {
      if (i > 0) {
        str += '&';
      }
      str += key + '=' + this.generateStr(o[key]);
    });
    return str;
  }


  makeHttpCall(requestParams: any, inputFields: any, successHandler: Function, errorHandler: Function) {
    let madeHttpCall = false;
    const serviceInfo = this.serviceInfo;
    const url = serviceInfo.directPath ||  serviceInfo.relativePath;
    const keyPrefix = 'API_INTERCEPTOR_CACHE.' + url + '?' + this.generateStr(inputFields);
    const context = new ServiceVariableContext(this, inputFields, {
      keyPrefix: keyPrefix,
      proceed: async () => {
        madeHttpCall = true;
        await this.httpService.sendCall(requestParams, this).then((successHandler)).catch(errorHandler);
        return this.dataSet;
      }
    });
    return interceptService.intercept(context).then(() => {
      if (madeHttpCall) {
        return;
      }
      this.config.onResult && this.config.onResult(this, this.dataSet);
      this.config.onSuccess && this.config.onSuccess(this, this.dataSet);
      return this.dataSet;
    }, (err: any) => {
      if (madeHttpCall) {
        return;
      }
      this.config.onResult && this.config.onResult(this, this.dataSet);
      this.config.onError && this.config.onError(this, this.dataSet);
      return Promise.reject(err);
    });
  }
}
