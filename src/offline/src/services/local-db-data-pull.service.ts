import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';

import { LiveVariableUtils, LVService } from '@wavemaker/variables';

import { EVENTS, LocalDBManagementService } from './local-db-management.service';
import { LocalKeyValueService } from './local-key-value.service';
import { DataModel, EntityInfo } from '../models/data.model';
import { Observer, PullType } from '../models/types';
import {
    cloneDeep,
    find,
    findIndex,
    isEmpty,
    isNaN,
    isNil, isString,
    map,
    reduce,
    remove,
    slice, sortBy,
    startsWith
} from "lodash-es";
import moment from 'moment';
import { Defer } from '@wavemaker/app-rn-runtime/core/defer';

const  LAST_PULL_INFO_KEY = 'localDBManager.lastPullInfo';


export interface PullInfo {
    databases: DBPullInfo[];
    inProgress: boolean;
    totalRecordsToPull: number;
    totalPulledRecordCount: number;
    startTime: Date;
    endTime: Date;
}

export interface DBPullInfo {
    name: string;
    entities: Array<any>;
    totalRecordsToPull: number;
    totalPulledRecordCount: number;
}

export interface EntityPullInfo {
    name: string;
    totalRecordsToPull: number;
    totalPulledRecordCount: number;
}


/**
 * a utility api to abort pull process.
 *
 * @type {{start, add, remove, abort}}
 */
class PullProcessManager {

    static INSTANCE = new PullProcessManager();

    private promiseStore: Map<Defer<any>, Defer<any>[]> = new Map();

    public start(pullPromise: Defer<any>) {
        this.promiseStore.set(pullPromise, []);
    }
    
    public add(pullPromise: Defer<PullInfo>, promise: Defer<any>) {
        let promises = this.promiseStore.get(pullPromise);
        if (!promises) {
            promises = [];
            this.promiseStore.set(pullPromise, promises);
        }
        promises.push(promise);
    }
    
    public remove(pullPromise: Defer<PullInfo>, promise: Defer<any>) {
        let promises = this.promiseStore.get(pullPromise);
        if (!promises) {
            return;
        }
        remove(promises, promise);
        if (isEmpty(promises)) {
            this.promiseStore.delete(pullPromise);
        }
    }
    
    public async abort(pullPromise: Defer<PullInfo>) {
        this.promiseStore.get(pullPromise)?.forEach((p: any) => {
            p?.abort?.();
        });
        this.promiseStore.delete(pullPromise);
    };
}

/**
 * LocalDBDataPullService has API to pull data from remote Server to local Database.
 */
export class LocalDBDataPullService {
  static readonly SERVICE_NAME = 'LocalDBDataPullService';
  constructor(
    private localDBManagementService: LocalDBManagementService,
    private localKeyValueService: LocalKeyValueService
  ) {
    // Listen for db creation. When db is created, then initialize last pull info.
    this.localDBManagementService.subscribe(
      EVENTS.DATABASE_CREATE,
      (info: any) => {
        this.localKeyValueService.put(LAST_PULL_INFO_KEY, {
          databases: [],
          totalRecordsToPull: 0,
          totalPulledRecordCount: 0,
          startTime: new Date(0),
          endTime: new Date(info.dbSeedCreatedOn),
        });
      }
    );
  }

  /**
   * If deltaFieldName is set,last pull time is greater than zero and query used in last pull is same as the
   * query for the current pull, then delta criteria is attached to the query.
   *
   * @param db
   * @param entityName
   * @param query
   * @returns {any}
   */
  private async addDeltaCriteria(
    db: DataModel,
    entityName: string,
    query: string
  ) {
    const entitySchema = db.schema.entities[entityName]!,
      deltaFieldName = entitySchema.pullConfig.deltaFieldName,
      deltaField = deltaFieldName && entitySchema.field(deltaFieldName)!;
    let modifiedQuery = query;
    try {
      if (!isEmpty(deltaFieldName)) {
        let isBundledEntity = await this.localDBManagementService.isBundled(
          db.schema.name,
          entityName
        );
        const lastPullInfo = await this.getLastPullInfo();
        let lastPullTime =
          lastPullInfo &&
          lastPullInfo.startTime &&
          lastPullInfo.startTime.getTime();
        const lastPullDBInfo = find(lastPullInfo && lastPullInfo.databases, {
            name: db.schema.name,
          }),
          lastPullEntityInfo =
            find(lastPullDBInfo && lastPullDBInfo.entities, {
              entityName: entityName,
            }) || {};

        if (!lastPullTime && isBundledEntity) {
          // For bundled entity when there is no last pull, fetch records that got modified after db creation.
          lastPullTime =
            lastPullInfo &&
            lastPullInfo.endTime &&
            lastPullInfo.endTime.getTime();
          lastPullEntityInfo.query = modifiedQuery;
        }
        if (lastPullEntityInfo.query === modifiedQuery && lastPullTime > 0) {
          if (isEmpty(modifiedQuery)) {
            modifiedQuery = '';
          } else {
            modifiedQuery += ' AND ';
          }
          if (deltaField && deltaField.column.sqlType === 'datetime') {
            modifiedQuery +=
              deltaFieldName +
              " > '" +
              moment(lastPullTime).utc().format('YYYY-MM-DDTHH:mm:ss') +
              "'";
          } else {
            modifiedQuery += deltaFieldName + ' > ' + lastPullTime;
          }
        }
        return modifiedQuery;
      }
    } catch (e) {
      // return the original query;
    }
    return query;
  }

  /**
   * copies the data from remote db to local db
   * @param {Database} db
   * @param {string} entityName
   * @param {boolean} clearDataBeforePull
   * @param pullPromise
   * @param {Observer<any>} progressObserver
   * @returns {Promise<any>}
   */
  private async copyDataFromRemoteDBToLocalDB(
    db: DataModel,
    entityName: string,
    clearDataBeforePull: boolean,
    pullPromise: Defer<PullInfo>,
    progressObserver: Observer<EntityPullInfo>
  ) {
    const store = (db as any).stores[entityName],
      entitySchema = db.schema.entities[entityName]!,
      result: EntityPullInfo = {
        name: entityName,
        totalRecordsToPull: 0,
        totalPulledRecordCount: 0,
      };

    let inProgress = 0,
      pullComplete = false,
      filter = '';
    return new Promise(async (resolve, reject) => {
      let query = await this.prepareQuery(db, entityName);
      (result as any).query = query;
      query = await this.addDeltaCriteria(db, entityName, query);
      // Clear if clearDataBeforePull is true and delta query is not used
      if (clearDataBeforePull && (result as any).query === query) {
        await store.clear();
      }
      filter = isEmpty(query) ? '' : 'q=' + query;
      const maxNoOfRecords = await this.getTotalRecordsToPull(
        db,
        entitySchema,
        filter,
        pullPromise
      );
      const pageSize = entitySchema.pullConfig.size || 100;
      const maxNoOfPages = Math.ceil(maxNoOfRecords / pageSize);
      result.totalRecordsToPull = maxNoOfRecords;
      let sort = entitySchema.pullConfig.orderBy;
      sort = (isEmpty(sort) ? '' : sort + ',') + store.primaryKeyName;
      progressObserver.next?.(result);
      const _progressObserver: Observer<any> = {
        next: async (data) => {
          inProgress++;
          data = slice(
            data,
            0,
            result.totalRecordsToPull - result.totalPulledRecordCount
          );
          await store.saveAll(data).then(
            () => {
              result.totalPulledRecordCount += data ? data.length : 0;
              progressObserver.next?.(result);
            },
            () => {}
          );
          inProgress--;
          if (inProgress === 0 && pullComplete) {
            resolve(result);
          }
        },
      };
      await this._pullEntityData(
        db,
        entityName,
        filter,
        sort,
        maxNoOfPages,
        pageSize,
        1,
        pullPromise,
        undefined,
        _progressObserver
      ).then(() => {
        pullComplete = true;
        if (inProgress === 0) {
          resolve(result);
        }
      }, reject);
    });
  }

  // If expression starts with 'bind:', then expression is evaluated and result is returned.
  private evalIfBind(expression: string) {
    if (startsWith(expression, 'bind:')) {
      expression = expression.replace(/\[\$\i\]/g, '[0]');
      // return $parseExpr(expression.replace('bind:', ''))(this.app);
    }
    return expression;
  }

  /**
   * Executes DatabaseService.countTableDataWithQuery as a promise API.
   * @param params
   * @returns Promise
   */
  private executeDatabaseCountQuery(params: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      LVService.countTableDataWithQuery(params, null, null).subscribe(
        (response: any) => resolve(response.body),
        reject
      );
    });
  }

  /**
   * Executes DatabaseService.searchTableDataWithQuery as a promise API.
   * @param params
   * @returns Promise
   */
  private executeDatabaseSearchQuery(params: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      return LVService.searchTableDataWithQuery(params, null, null).subscribe(
        (response: any) =>
          resolve(response && response.body && response.body.content),
        reject
      );
    });
  }

  /**
   * Computes the maximum number of records to pull.
   *
   * @param db
   * @param entitySchema
   * @param filter
   * @param pullPromise
   * @returns {*}
   */
  private getTotalRecordsToPull(
    db: DataModel,
    entitySchema: EntityInfo,
    filter: string,
    pullPromise: Defer<PullInfo>
  ): Promise<number> {
    const params = {
      dataModelName: db.schema.name,
      entityName: entitySchema.entityName,
      queryParams: filter,
    };
    return this.retryIfNetworkFails(() => {
      return this.executeDatabaseCountQuery(params).then(function (response) {
        const totalRecordCount = response,
          maxRecordsToPull = parseInt(
            (entitySchema.pullConfig as any).maxNumberOfRecords
          );
        if (
          isNaN(maxRecordsToPull) ||
          maxRecordsToPull <= 0 ||
          totalRecordCount < maxRecordsToPull
        ) {
          return totalRecordCount;
        }
        return maxRecordsToPull;
      });
    }, pullPromise).promise;
  }

  private async prepareQuery(
    db: DataModel,
    entityName: string
  ): Promise<string> {
    let query;
    const entitySchema = db.schema.entities[entityName]!;
    const isBundledEntity = await this.localDBManagementService.isBundled(
      db.schema.name,
      entityName
    );
    let hasNullAttributeValue = false;
    if (isBundledEntity || isEmpty(entitySchema.pullConfig.query)) {
      query = cloneDeep(entitySchema.pullConfig.filter);
      query = map(query, (v) => {
        v.attributeValue = this.evalIfBind(v.attributeValue);
        hasNullAttributeValue =
          hasNullAttributeValue || isNil(v.attributeValue);
        return v;
      });
      if (hasNullAttributeValue) {
        return Promise.reject('Null criteria values are present');
      }
      query = sortBy(query, 'attributeName');
      query = LiveVariableUtils.getSearchQuery(query, ' AND ', true);
    } else {
      query = this.evalIfBind(entitySchema.pullConfig.query);
    }
    if (isNil(query)) {
      return '';
    }
    return encodeURIComponent(query);
  }

  /**
   *
   * @param db
   * @param clearDataBeforePull
   * @param pullPromise
   * @param progressObserver
   * @returns {*}
   */
  private async _pullDbData(
    db: DataModel,
    clearDataBeforePull: boolean,
    pullPromise: Defer<PullInfo>,
    progressObserver: Observer<DBPullInfo>
  ): Promise<any> {
    const datamodelName = db.schema.name,
      result: DBPullInfo = {
        name: db.schema.name,
        entities: [] as EntityPullInfo[],
        totalRecordsToPull: 0,
        totalPulledRecordCount: 0,
      };

    const storePromises: Promise<any>[] = [];
    Object.values(db.schema.entities).forEach((entity) => {
      storePromises.push(
        this.localDBManagementService.getStore(datamodelName, entity.entityName)
      );
    });
    const stores = await Promise.all(storePromises);
    const entities: string[] = [];
    stores.forEach((store) => {
      const pullConfig = store.entitySchema.pullConfig;
      const pullType = pullConfig.pullType;
      if (
        pullType === PullType.APP_START ||
        (pullType === PullType.BUNDLED && (pullConfig as any).deltaFieldName)
      ) {
        entities.push(store.entitySchema);
      }
    });
    await Promise.all(
      entities.map(async (entity) => {
        const _progressObserver: Observer<EntityPullInfo> = {
          next: (info) => {
            const i = result.entities.findIndex(
              (entityName) => entityName.name === entity
            );
            if (i >= 0) {
              result.entities[i] = info;
            } else {
              result.entities.push(info);
            }
            result.totalPulledRecordCount = result.entities.reduce(
              (sum, entityPullInfo) => {
                return sum + entityPullInfo.totalPulledRecordCount;
              },
              0
            );
            result.totalRecordsToPull = result.entities.reduce(
              (sum, entityPullInfo) => {
                return sum + entityPullInfo.totalRecordsToPull;
              },
              0
            );
            progressObserver.next?.(result);
          },
        };
        const info = await this.copyDataFromRemoteDBToLocalDB(
          db,
          entity,
          clearDataBeforePull,
          pullPromise,
          _progressObserver
        );
        progressObserver.next?.(result);
        return info;
      })
    );
  }

  /**
   * Pulls data of the given entity from remote server.
   * @param db
   * @param entityName
   * @param sort
   * @param maxNoOfPages
   * @param pageSize
   * @param currentPage
   * @param filter
   * @param pullPromise
   * @param promise
   * @returns {*}
   */
  private _pullEntityData(
    db: DataModel,
    entityName: string,
    filter: string,
    sort: string,
    maxNoOfPages: number,
    pageSize: number,
    currentPage: number,
    pullPromise: Defer<PullInfo>,
    deferred: any,
    progressObserver?: Observer<EntityPullInfo>
  ) {
    const dataModelName = db.schema.name;

    if (!deferred) {
      deferred = new Defer();
    }

    if (currentPage > maxNoOfPages) {
      return deferred.resolve();
    }
    const params = {
      dataModelName: dataModelName,
      entityName: entityName,
      page: currentPage,
      size: pageSize,
      data: filter,
      sort: sort,
      onlyOnline: true,
      skipLocalDB: true,
    };
    this.retryIfNetworkFails(() => {
      return this.executeDatabaseSearchQuery(params);
    }, pullPromise).promise.then((response: any) => {
      progressObserver?.next?.(response);
      this._pullEntityData(
        db,
        entityName,
        filter,
        sort,
        maxNoOfPages,
        pageSize,
        currentPage + 1,
        pullPromise,
        deferred,
        progressObserver
      );
    }, deferred.reject);

    return deferred.promise;
  }

  /**
   * If fn fails and network is not there
   * @param fn
   * @param pullPromise
   * @returns {*}
   */
  private retryIfNetworkFails(
    fn: Function,
    pullPromise: Defer<PullInfo>
  ) {
    if (pullPromise.isAborted) {
      return Defer.reject<number>('Aborted');
    }
    const defer = NetworkService.retryIfNetworkFails<number>(fn);
    PullProcessManager.INSTANCE.add(pullPromise, defer);
    defer.promise.catch(() => {}).then(() => {
      PullProcessManager.INSTANCE.remove(pullPromise, defer);
    });
    return defer;
  }

  /**
   * Tries to cancel the corresponding pull process that gave the given promise.
   * @param promise
   * @returns {any}
   */
  public cancel(promise: Defer<any>) {
    return PullProcessManager.INSTANCE.abort(promise);
  }

  /**
   * fetches the database from the dbName.
   * @param dbName
   * @returns {Promise<any>}
   */
  public getDb(dbName: string) {
    return this.localDBManagementService.loadDatabases().then((databases) => {
      const db = databases[dbName];
      return db || Promise.reject('Local database (' + dbName + ') not found');
    });
  }

  /**
   * @returns {any} that has total no of records fetched, start and end timestamps of last successful pull
   * of data from remote server.
   */
  public getLastPullInfo(): Promise<PullInfo> {
    return this.localKeyValueService.get(LAST_PULL_INFO_KEY).then((info: PullInfo) => {
      if (isString(info.startTime)) {
        info.startTime = new Date(info.startTime);
      }
      if (isString(info.endTime)) {
        info.endTime = new Date(info.endTime);
      }
      return info;
    });
  }

  /**
   * Clears (based on parameter) and pulls data ('BUNDLED' data based on parameter) from server using the
   * configured rules in offline configuration.
   *
   * @param clearDataBeforePull boolean
   * @param {Observer<any>} progressObserver
   * @returns {any}
   */
  public async pullAllDbData(
    clearDataBeforePull: boolean,
    progressObserver: Observer<any>
  ): Promise<PullInfo> {
    const deferred = new Defer<PullInfo>(),
    pullInfo: PullInfo = {
        inProgress: true,
        databases: [],
        totalRecordsToPull: 0,
        totalPulledRecordCount: 0,
        startTime: new Date(),
        endTime: new Date(),
    };
    const databases = Object.values((await this.localDBManagementService.loadDatabases()))
        .filter(db => !db.schema.isInternal);
    PullProcessManager.INSTANCE.start(deferred);
    const _progressObserver: Observer<DBPullInfo> = {
        next: (data) => {
            const i = findIndex(pullInfo.databases, { name: data.name });
            if (i >= 0) {
                pullInfo.databases[i] = data;
            } else {
                pullInfo.databases.push(data);
            }
            pullInfo.totalPulledRecordCount = reduce(
                pullInfo.databases,
                function (sum, dbPullInfo) {
                return sum + dbPullInfo.totalPulledRecordCount;
                },
                0
            );
            pullInfo.totalRecordsToPull = reduce(
                pullInfo.databases,
                function (sum, dbPullInfo) {
                return sum + dbPullInfo.totalRecordsToPull;
                },
                0
            );
            progressObserver.next?.(pullInfo);
        },
    };
    Promise.all(databases.map(db => this._pullDbData(
        db,
        clearDataBeforePull,
        deferred,
        _progressObserver
    ))).then(() => {
        pullInfo.endTime = new Date();
        pullInfo.inProgress = false;
        this.localKeyValueService.put(LAST_PULL_INFO_KEY, pullInfo);
        deferred.resolve(pullInfo);
    }, deferred.reject);
    return deferred.promise;
  }

  /**
   * Clears (based on parameter) and pulls data ('BUNDLED' data based on parameter) of the given database from server using
   * the configured rules in offline configuration.
   *
   * @param {string} databaseName
   * @param {boolean} clearDataBeforePull
   * @param {Observer<any>} progressObserver
   * @returns {Promise}
   */
  public pullDbData(
    databaseName: string,
    clearDataBeforePull: boolean,
    progressObserver: Observer<any>
  ): Promise<any> {
    const deferred = new Defer<any>();

    this.getDb(databaseName)
      .then((db) => {
        return this._pullDbData(
          db,
          clearDataBeforePull,
          deferred,
          progressObserver
        );
      })
      .then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }

  /**
   * Clears (based on parameter) and pulls data of the given entity and database from
   * server using the configured rules in offline configuration.
   * @param databaseName, name of the database from which data has to be pulled.
   * @param entityName, name of the entity from which data has to be pulled
   * @param clearDataBeforePull, if set to true, then data of the entity will be deleted.
   * @param progressObserver, observer the progress values
   */
  public pullEntityData(
    databaseName: string,
    entityName: string,
    clearDataBeforePull: boolean,
    progressObserver: Observer<any>
  ): Promise<any> {
    const deferred = new Defer<any>();

    this.getDb(databaseName)
      .then((db) => {
        return this.copyDataFromRemoteDBToLocalDB(
          db,
          entityName,
          clearDataBeforePull,
          deferred,
          progressObserver
        );
      })
      .then(deferred.resolve, deferred.reject);

    return deferred.promise;
  }
}
