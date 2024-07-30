import { VariableConfig, VariableEvents } from './base-variable';
import { isEqual, assignIn, isString } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { ServiceVariable as _ServiceVariable } from '@wavemaker/variables/src/model/variable/service-variable';
import httpService from '@wavemaker/app-rn-runtime/variables/http.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';

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
  private cancelTokenSource: any;
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
}
