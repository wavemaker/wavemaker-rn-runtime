import { Change, FlushContext, Worker } from '../change-log.service';
import { LocalDBStore } from '../../models/local-db-store';
import { isNull, isObject, isUndefined } from 'lodash-es';

const STORE_KEY = 'errorBlockerStore';

export class ErrorBlocker implements Worker {
  private errorStore: {
    [dataModelName: string]: {
      [entityName: string]: {
        [id: string]: boolean;
      };
    };
  } = {};

  constructor() {}

  public preFlush(context: FlushContext) {
    this.errorStore = context.get(STORE_KEY);
  }

  // block all calls related to the error entities
  public preCall(change: Change, store?: LocalDBStore) {
    if (change && change.service === 'DatabaseService') {
      store = store!;
      const entityName = change.params.entityName;
      const dataModelName = change.params.dataModelName;
      switch (change.operation) {
        case 'insertTableData':
        case 'insertMultiPartTableData':
        case 'updateTableData':
        case 'updateMultiPartTableData':
        case 'deleteTableData':
          return this.blockCall(
            store,
            change,
            dataModelName,
            entityName,
            change.operation === 'deleteTableData' ? change.params : change.params.data
          );
      }
    }
  }

  // store error entity id
  public postCallSuccess(change: Change, store?: LocalDBStore) {
    if (change && change.service === 'DatabaseService') {
      store = store!;
      const entityName = change.params.entityName;
      const dataModelName = change.params.dataModelName;
      const id =
        change.dataLocalId ||
        change.params.data[store!.primaryKeyField.name];
      if (!(isUndefined(id) || isNull(id))) {
        this.removeError(dataModelName, entityName, id);
      }
    }
  }

  // store error entity id
  public postCallError(change: Change, store?: LocalDBStore) {
    if (change && change.service === 'DatabaseService') {
      store = store!;
      const entityName = change.params.entityName;
      const dataModelName = change.params.dataModelName;
      const id =
        change.dataLocalId ||
        (change.params.data &&
          change.params.data[store.primaryKeyField.name]) ||
        change.params[store.primaryKeyField.name] ||
        change.params.id;
      if (!(isUndefined(id) || isNull(id))) {
        this.recordError(dataModelName, entityName, id);
      }
    }
  }

  /**
   * If there is an earlier call of the object or its relations that got failed, then this call will be
   * marked for discard.
   *
   * @param store LocalDBStore
   * @param change change to block
   * @param dataModelName
   * @param entityName
   * @param data
   */
  private blockCall(
    store: LocalDBStore,
    change: Change,
    dataModelName: string,
    entityName: string,
    data: any
  ) {
    if (change.hasError === 0) {
      this.checkForPreviousError(
        store,
        change,
        dataModelName,
        entityName,
        data
      );
      store.entityInfo.fields
        .filter((f) => !!f.relatedEntity)
        .some((f) => {
          if (isObject(data[f.name])) {
            this.blockCall(
              store,
              change,
              dataModelName,
              f.relatedEntity!.entityName,
              data[f.name]
            );
          } else if (data[f.name]) {
            this.checkForPreviousError(
              store,
              change,
              dataModelName,
              f.entity.entityName,
              data,
              f.name
            );
          }
          return change.hasError === 1;
        });
    }
  }

  // A helper function to check for earlier failures.
  private checkForPreviousError(
    store: LocalDBStore,
    change: Change,
    dataModelName: string,
    entityName: string,
    data: any,
    key?: any
  ) {
    const primaryKey = key || store.primaryKeyField.name;
    if (this.hasError(dataModelName, entityName, data[primaryKey])) {
      change.hasError = 1;
      change.errorMessage = `Blocked call due to error in previous call of entity [ ${entityName} ] with id [ ${data[primaryKey]} ]`;
    }
  }

  private hasError(dataModelName: string, entityName: string, id: any) {
    if (
      this.errorStore[dataModelName] &&
      this.errorStore[dataModelName][entityName] &&
      this.errorStore[dataModelName][entityName][id]
    ) {
      return true;
    }
    return false;
  }

  // Removes entity identifier from error list.
  private removeError(dataModelName: string, entityName: string, id: any) {
    if (
      this.errorStore[dataModelName] &&
      this.errorStore[dataModelName][entityName] &&
      this.errorStore[dataModelName][entityName][id]
    ) {
      delete this.errorStore[dataModelName][entityName][id];
    }
  }

  // Save error entity identifier.
  private recordError(dataModelName: string, entityName: string, id: any) {
    this.errorStore[dataModelName] = this.errorStore[dataModelName] || {};
    this.errorStore[dataModelName][entityName] =
      this.errorStore[dataModelName][entityName] || {};
    this.errorStore[dataModelName][entityName][id] = true;
  }
}
