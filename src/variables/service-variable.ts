import { VariableConfig, VariableEvents } from './base-variable';
import { isEqual, isEmpty } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { $queue } from './utils/inflight-queue';
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
    const variableConfig = {
      name: config.name,
      dataSet: config.paramProvider(),
      dataBinding: config.paramProvider(),
      isList: config.isList,
      service: config.service,
      serviceType: config.serviceType,
      maxResults: config.maxResults,
      _context: config._context,
      operation: config.operation,
      operationId: config.operationId,
      serviceInfo: config.getServiceInfo(),
      httpClientService: httpService,
      onSuccess: (context: any, args: any) => {
        return config.onSuccess && config.onSuccess(args.variable, args.data, args.options);
      },
      onError: (context: any, args: any) => {
        return config.onError && config.onError(args.variable, args.data, args.options);
      },
      onCanUpdate: (context: any, args: any) => {
        return config.onCanUpdate && config.onCanUpdate(args.variable, args.data, args.options);
      },
      onBeforeUpdate: (context: any, args: any) => {
        return config.onBeforeUpdate && config.onBeforeUpdate(args.variable, args.data, args.options);
      },
      onResult: (context: any, args: any) => {
        return config.onResult && config.onResult(args.variable, args.data, args.options);
      },
      onBeforeDatasetReady: (context: any, args: any) => {
        return config.onBeforeDatasetReady && config.onBeforeDatasetReady(args.variable, args.data, args.options);
      }
    }
    super(variableConfig);
  }

  invokeOnParamChange() {
    const last = this.params;
    const latest = this.config.paramProvider();
    if (!isEqual(last, latest)) {
      this.invoke(latest);
    }
    return Promise.resolve(this);
  }

  public doNext(currentPage: number) {
    // this.invoke({
    //   page: currentPage
    // });
    return Promise.reject(this);
  }

  onDataUpdated() {
    this.appConfig.refresh(false);
  }

  invoke(options? : any, onSuccess?: Function, onError?: Function) {
    this.params = this.config.paramProvider();
    let params = options ? (options.inputFields ? options.inputFields : options) : undefined;
    if (!params) {
      params = !isEmpty(this.dataBinding) ? this.dataBinding : this.config.paramProvider();
    }
    this.dataBinding = params;
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
