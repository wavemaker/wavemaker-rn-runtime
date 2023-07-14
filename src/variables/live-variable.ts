import { VariableConfig, VariableEvents } from './base-variable';
import { isEqual, isUndefined, isFunction, forEach, isEmpty } from 'lodash';
import AppConfig from '@wavemaker/app-rn-runtime/core/AppConfig';
import { LiveVariable as _LiveVariable } from '@wavemaker/variables/src/model/variable/live-variable';
import httpService from '@wavemaker/app-rn-runtime/variables/http.service';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import Formatters from '@wavemaker/app-rn-runtime/core/formatters';

export interface LiveVariableConfig extends VariableConfig {
  baseUrl: string;
  maxResults: number;
  _context: any;
  onCanUpdate: any;
  onBeforeUpdate: any;
  onResult: any;
  onBeforeDatasetReady: any;
  inFlightBehavior: string;
  type: string;
  autoUpdate: boolean;
  orderBy: string;
  category: string;
  liveSource: string;
  propertiesMap: any;
  properties: any;
  tableName: string;
  tableType: string;
  relatedTables: any;
  filterExpressions: any;
  filterProvider: any;
}

enum _LiveVariableEvents {
  BEFORE_INVOKE = 'beforeInvoke'
}
export type LiveVariableEvents = _LiveVariableEvents | VariableEvents;

export class LiveVariable extends _LiveVariable {
  params: any = {};
  filters: any = {};
  public appConfig = injector.get<AppConfig>('APP_CONFIG');

  constructor(public config: LiveVariableConfig) {
    const variableConfig = {
      name: config.name,
      dataSet: config.paramProvider(),
      inputFields: config.paramProvider(),
      filterExpressions: config.filterExpressions,
      filterFields: config.paramProvider(),
      isList: config.isList,
      maxResults: config.maxResults,
      _context: config._context,
      operation: config.operation,
      type: config.type,
      autoUpdate: config.autoUpdate,
      liveSource: config.liveSource,
      orderBy: config.orderBy,
      category: config.category,
      properties: config.properties,
      propertiesMap: config.propertiesMap,
      tableName: config.tableName,
      tableType: config.tableType,
      relatedTables: config.relatedTables,
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
        return config.onBeforeUpdate && config.onBeforeUpdate(args.variable, args.dataFilter || args.inputData, args.options);
      },
      onResult: (context: any, args: any) => {
        return config.onResult && config.onResult(args.variable, args.data, args.options);
      },
      onBeforeDatasetReady: (context: any, args: any) => {
        return config.onBeforeDatasetReady && config.onBeforeDatasetReady(args.variable, args.data, args.options);
      }
    }
    super(variableConfig);
    this.dateFormatter = Formatters.get('toDate');
    this.init();
  }

  setFilterExpValue(filter: any) {
    this.filterExpressions?.rules.forEach((r: any) => {
      r.value = filter[r.target];
    });
  }

  invokeOnParamChange() {
    const last = this.params;
    const latest = this.config.paramProvider();
    if (this.config.operation === 'read') {
      const lastFilter = this.filters;
      const latestFilter = this.config.filterProvider && this.config.filterProvider();
      if (!isEqual(lastFilter, latestFilter)) {
        this.setFilterExpValue(latestFilter);
        if (this.autoUpdate && !isEmpty(latestFilter) && isFunction(this.update)) {
          this.filters = latestFilter;
          this.invoke();
        }
      }
    }
    if (!isEqual(last, latest)) {
      if (this.config.operation === 'read') {
        forEach(latest, (val: any, key: any) => {
          this.filterFields[key] = {
            'value': val
          };
        });
      } else {
        this.inputFields = latest;
      }
      /* if auto-update set for the variable with read operation only, get its data */
      // @ts-ignore
      if (this.autoUpdate && !isUndefined(latest) && isFunction(this[this.config.operation + 'Record'])) {
        this.invoke();
      }
    }
    return Promise.resolve(this);
  }

  listRecords(options? : any, onSuccess?: Function, onError?: Function) {
    this.filters = this.config.filterProvider && this.config.filterProvider();
    if (options) {
      this.filters = deepCopy({} as any, this.filters, options.filterFields ? options.filterFields : options);
    }
    options = options || {};
    options.filterFields = this.filters;
    this.setFilterExpValue(this.filters);
    return super.listRecords(options, onSuccess, onError);
  }

}
