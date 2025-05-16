import NetworkService from '@wavemaker/app-rn-runtime/core/network.service';

import { LocalDBManagementService } from './local-db-management.service';
import { LocalKeyValueService } from './local-key-value.service';
import { LocalDBStore } from '../models/local-db-store';
import { Observer } from '../models/types';
import {isNull, isString, isUndefined, map, reverse} from "lodash-es";
import { Defer } from '@wavemaker/app-rn-runtime/core/defer';

export interface Change {
    id?: number;
    errorMessage?: string;
    hasError: number;
    operation: string;
    params: any;
    service: 'DatabaseService' | 'OfflineFileUploadService';
    dataLocalId: number | string;
}

export interface FlushContext {
    clear: () => Promise<any>;
    get: (key: string) => any;
    save: () => Promise<any>;
}

export interface Worker {
    onAddCall?: (change: Change, store?: LocalDBStore) => (Promise<any> | void);
    preFlush?: (context: FlushContext) => (Promise<any> | void);
    postFlush?: (pushInfo: PushInfo, context: FlushContext) => (Promise<any> | void);
    preCall?: (change: Change, store?: LocalDBStore) => (Promise<any> | void);
    postCallError?: (change: Change, error: any, store?: LocalDBStore) => (Promise<any> | void);
    postCallSuccess?: (change: Change, response: any, store?: LocalDBStore) => (Promise<any> | void);
    transformParamsToMap?: (change: Change, store?: LocalDBStore) => (Promise<any> | void);
    transformParamsFromMap?: (change: Change, store?: LocalDBStore) => (Promise<any> | void);
}

export interface PushInfo {
    completedTaskCount: number;
    endTime: Date;
    failedTaskCount: number;
    inProgress: boolean;
    startTime: Date;
    successfulTaskCount: number;
    totalTaskCount: number;
}

export abstract class PushService {
    public abstract push(change: Change): Promise<any>;
}

export const CONTEXT_KEY = 'changeLogService.flushContext';
export const LAST_PUSH_INFO_KEY = 'changeLogService.lastPushInfo';

export class ChangeLogService {
    static readonly SERVICE_NAME = 'ChangeLogService';

    private workers: Worker[] = [];

    private flushContext: FlushContext | undefined = {} as any;

    private currentPushInfo: PushInfo;

    private deferredFlush: any;

    constructor(private localDBManagementService: LocalDBManagementService,
                private localKeyValueService: LocalKeyValueService,
                private pushService: PushService) {
        this.currentPushInfo = {} as PushInfo;
        this.addWorker(new FlushTracker(this,  this.localKeyValueService, this.currentPushInfo));
    }

    public async executeInSync(fns: Function[]): Promise<any> {
        if (fns && fns.length) {
            await (fns.shift()!)();
            await this.executeInSync(fns);
        }
    }

    private async getStore(change: Change) {
        if (change.params?.dataModelName && change.params?.entityName){
            return await this.localDBManagementService.getStore(change.params.dataModelName, change.params.entityName);
        }
        return undefined;
    }


    /**
     * adds a service call to the log. Call will be invoked in next flush.
     *
     * @Param {string} name of service (This should be available through $injector)
     * @Param {string} name of method to invoke.
     * @Param {object} params
     */
    public async add(service: string, operation: string, params: any): Promise<void> {
        const change: Change = {
            service: service,
            operation: operation,
            params: params,
            hasError: 0
        } as any;
        const store = await this.getStore(change);
        await this.executeInSync(this.workers.map(w => () => w.transformParamsToMap?.(change, store)));
        await this.executeInSync(this.workers.map(w => () => w.onAddCall?.(change, store)));
        change.params = JSON.stringify(change.params);
        return this.getChangeStore().then(store => store.add(change)).then(() => {});
    }

    public addWorker(worker: Worker) {
        this.workers.push(worker);
    }

    /**
     * Clears the current log.
     */
    public clearLog() {
        return this.getChangeStore().then( s => s.clear());
    }

    /**
     * Flush the current log. If a flush is already running, then the promise of that flush is returned back.
     */
    public async flush(progressObserver: Observer<PushInfo>): Promise<PushInfo> {
        if (!this.deferredFlush) {
            this.deferredFlush = new Defer<any>();
            this.flushContext = await this.createContext();
            await this.executeInSync(this.workers.map(w => () => w.preFlush?.(this.flushContext!)));
            await Promise.resolve(() => {
                const flushPromise = this._flush(progressObserver);
                this.deferredFlush.onAbort = () => (flushPromise as any).abort();
                return flushPromise;
            });
            if (this.currentPushInfo.totalTaskCount === this.currentPushInfo.completedTaskCount) {
                await this.flushContext.clear();
                this.flushContext = null as any;
            }
            progressObserver.complete?.();
            if (this.currentPushInfo.failedTaskCount > 0) {
                this.deferredFlush.reject(this.currentPushInfo);
            } else {
                this.deferredFlush.resolve(this.currentPushInfo);
            }
            this.deferredFlush = null;
            await this.executeInSync(
                this.workers.map(w => () => w.postFlush?.(this.currentPushInfo, this.flushContext!))
            );
        }
        return this.deferredFlush.promise;
    }

    /**
     * Returns the complete change list
     */
    public async getChanges() {
        const changes = (await this.getChangeStore().then( s => s.filter(undefined, 'id', {
            offset: 0,
            limit: 500
        }))) as Change[];
        changes.forEach(change => {
            change.params = JSON.parse(change.params);
        });
        return changes;
    }


    /**
     * @returns {array} an array of changes that failed with error.
     */
    public async getErrors(): Promise<Change[]> {
        return this.getChangeStore().then( s => s.filter([{
            attributeName: 'hasError',
            attributeValue: 1,
            attributeType: 'NUMBER',
            filterCondition: 'EQUALS'
        }]));
    }


    public async getLastPushInfo(): Promise<PushInfo> {
        const lastPushInfo = this.localKeyValueService.get(LAST_PUSH_INFO_KEY);
        if (isString(lastPushInfo.startTime)) {
            lastPushInfo.startTime = new Date(lastPushInfo.startTime);
        }
        if (isString(lastPushInfo.endTime)) {
            lastPushInfo.endTime = new Date(lastPushInfo.endTime);
        }
        return lastPushInfo;
    }
    /**
     * @returns {number} number of changes that are pending to push.
     */
    public async getLogLength(): Promise<number> {
        return this.getChangeStore().then( s => s.count([{
            attributeName: 'hasError',
            attributeValue: 0,
            attributeType: 'NUMBER',
            filterCondition: 'EQUALS'
        }]));
    }

    /*
    * Retrieves the entity store to use by ChangeLogService.
    */
    public async getChangeStore(): Promise<LocalDBStore> {
        return (await this.localDBManagementService.getStore('wavemaker', 'offlineChangeLog'))!;
    }

    /**
     * Returns true, if a flush process is in progress. Otherwise, returns false.
     *
     * @returns {boolean} returns true, if a flush process is in progress. Otherwise, returns false.
     */
    public isFlushInProgress(): boolean {
        return !(isUndefined(this.deferredFlush) || isNull(this.deferredFlush));
    }

    /**
     * Stops the ongoing flush process.
     *
     * @returns {object} a promise that is resolved when the flush process is stopped.
     */
    public stop(): Promise<void> {
        return new Promise( resolve => {
            if (this.deferredFlush) {
                this.deferredFlush.promise.catch().then(resolve);
                this.deferredFlush.promise.abort();
            } else {
                resolve();
            }
        });
    }

    private async createContext() {
        let context: any = (await this.localKeyValueService.get(CONTEXT_KEY)) || {};
        return {
            'clear' : () => {
                context = {};
                return this.localKeyValueService.remove(CONTEXT_KEY);
            },
            'get' : (key: any) => {
                let value = context[key];
                if (!value) {
                    value = {};
                    context[key] = value;
                }
                return value;
            },
            'save' : () => this.localKeyValueService.put(CONTEXT_KEY, context)
        };
    }

    // Flushes the complete log one after another.
    private async _flush(progressObserver: Observer<PushInfo>, defer?: Defer<any>) {
        defer = defer || new Defer<any>();
        if (defer.isAborted) {
            return Promise.resolve();
        }
        const change = await this.getNextChange();
        if (!change) {
            return;
        }
        change.params = JSON.parse(change.params);
        await this.flushChange(change);
        const changeStore = await this.getChangeStore();
        try {
            progressObserver.next?.(this.currentPushInfo);
            await changeStore.delete(change.id);
            await this._flush(progressObserver, defer);
        } catch(e) {
            if (NetworkService.isConnected()) {
                change.hasError = 1;
                change.params = JSON.stringify(change.params);
                await changeStore.save(change);
                await this._flush(progressObserver, defer);
            } else {
                let connectDefer = NetworkService.onConnect();
                defer.promise.catch(function () {
                    if (connectDefer) {
                        connectDefer.abort();
                    }
                });
                connectDefer.promise.then(() => {
                    this._flush(progressObserver, defer);
                    connectDefer = null as any;
                });
            }
        };
        return defer.promise;
    }

    private async flushChange(change: Change): Promise<Change> {
        const self = this;
        const store = await this.getStore(change);
        try {
            await this.executeInSync(
                this.workers.map(w => () => w.preCall?.(change, store))
            );
            if (change.hasError) {
                throw new Error(change.errorMessage || 'ERROR');
            }
            await this.executeInSync(
                this.workers.map(w => () => w.transformParamsFromMap?.(change, store))
            );
            return await this.pushService.push(change).then(function() {
                return self.executeInSync(
                    self.workers.reverse().map(w => () => w.postCallSuccess?.(change, arguments, store))
                ).then(() => change);
            })
        } catch(e) {
            if (NetworkService.isConnected()) {
                await this.executeInSync(
                    self.workers.reverse().map(w => () => w.postCallError?.(change, e, store))
                ).catch(() => {});
            }
            return Promise.reject(change);
        }
    }



    // Flushes the first registered change.
    private getNextChange(): Promise<Change> {
        const filterCriteria = [{
            attributeName: 'hasError',
            attributeValue: 0,
            attributeType: 'NUMBER',
            filterCondition: 'EQUALS'
        }];
        return this.getChangeStore().then(s => s.filter(filterCriteria, 'id', {
            offset: 0,
            limit: 1
        })).then((changes: Array<Change>) => {
            return changes && changes[0];
        });
    }

    private getWorkers(type: string) {
        return map(this.workers, (w: any) => w[type] && w[type].bind(w));
    }
}

class FlushTracker implements Worker {

    private flushContext: FlushContext = {} as any;
    private logger: any;

    constructor(private changeLogService: ChangeLogService,
                private localKeyValueService: LocalKeyValueService,
                private pushInfo: PushInfo) {
        this.logger = window.console;
    }

    public onAddCall(change: Change) {
        this.logger.debug('Added the following call %o to log.', change);
    }

    public preFlush(flushContext: FlushContext) {
        this.pushInfo.totalTaskCount = 0;
        this.pushInfo.successfulTaskCount = 0;
        this.pushInfo.failedTaskCount = 0;
        this.pushInfo.completedTaskCount = 0;
        this.pushInfo.inProgress = true;
        this.pushInfo.startTime = new Date();
        this.flushContext = flushContext;
        this.logger.debug('Starting flush');
        return this.changeLogService.getChangeStore().then(store => {
            return store.count([{
                attributeName: 'hasError',
                attributeValue: 0,
                attributeType: 'NUMBER',
                filterCondition: 'EQUALS'
            }]);
        }).then(count => this.pushInfo.totalTaskCount = count);
    }

    public postFlush(stats: PushInfo , flushContext: FlushContext) {
        this.logger.debug('flush completed. {Success : %i , Error : %i , completed : %i, total : %i }.',
            this.pushInfo.successfulTaskCount, this.pushInfo.failedTaskCount, this.pushInfo.completedTaskCount, this.pushInfo.totalTaskCount);
        this.pushInfo.inProgress = false;
        this.pushInfo.endTime = new Date();
        this.localKeyValueService.put(LAST_PUSH_INFO_KEY, this.pushInfo);
        this.flushContext = {} as any;
    }

    public preCall(change: Change) {
        this.logger.debug('%i. Invoking call %o', (1 + this.pushInfo.completedTaskCount), change);
    }

    public postCallError(change: Change, response: any) {
        this.pushInfo.completedTaskCount++;
        this.pushInfo.failedTaskCount++;
        this.logger.error('call failed with the response %o.', response);
        return this.flushContext.save();
    }

    public postCallSuccess(change: Change, response: any) {
        this.pushInfo.completedTaskCount++;
        this.pushInfo.successfulTaskCount++;
        this.logger.debug('call returned the following response %o.', response);
        return this.flushContext.save();
    }
}
