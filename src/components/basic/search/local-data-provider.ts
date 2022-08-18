import { filter, includes, values, isNumber, split, toLower, get, toString, isArray, isObject, isString } from 'lodash';
import { BaseComponent } from "@wavemaker/app-rn-runtime/core/base.component";

export class DataProvider {
  private localDataProvider = new LocalDataProvider();

  // check if the variable is of type service variable and whether update is required.
  init(self: BaseComponent<any, any, any>) {
    let response = self.invokeEventCallback('isUpdateRequired', []);
    return response;
  }

  // setting the inputFields and invoking the variable
  invokeVariable(self: BaseComponent<any, any, any>, query: string): Promise<any> {
    let paramsObj: {[key: string] : any} | null = null;
    self.props.searchkey.split(',').forEach((k: string) => {
      if (!paramsObj) {
        paramsObj = {};
      }
      paramsObj[k] = query
    });
    let invokeEvent = get(self.props, 'formfield') ? self.props.invokeEvent : self.invokeEventCallback;
    if (invokeEvent) {
      return invokeEvent.call(self, 'onQuerySearch', [paramsObj]);
    }
    return Promise.resolve();
  }

  filter(config: any, cb? : () => void | null) {
    const props = config.props;
    if (props.searchkey) {
      const keys = split(props.searchkey, ',');
      if (keys.length && cb) {
        cb();
        return;
      }
    }
    return this.localDataProvider.filter(config);
  }
}

export class LocalDataProvider {

  private applyFilter(entry: any, queryText: any) {
    entry = isNumber(entry) ? entry.toString() : entry;
    return includes(entry, queryText);
  }

  filter(config: any) {
    const entries = config.entries;
    let queryText = config.query;
    const props = config.props;
    let filteredData;
    const casesensitive = false;

    /**
     * If searchkey is defined, then check for match string against each item in the dataset with item's field name as the searchkey
     * return the filtered data containing the matching string.
     */
    if (props.searchkey) {
      const keys = split(props.searchkey, ',');

      if (!entries.length) {
        return [];
      }

      let entryObj = entries[0];
      entryObj = entryObj.hasOwnProperty('dataObject') ? entryObj['dataObject'] : entryObj;
      const entryKeys = Object.keys(entryObj);
      const hasEntry = keys.find(k => {
        if (k.includes('.')) {
          k = split(k, '.')[0]
        }
        return entryKeys.includes(k)
      });

      if (!hasEntry) {
        // widget bound to query variable, searchkey is query or path params and not the key from the entry obj
        return entries;
      }

      filteredData = filter(entries, (item: any) => {
        return keys.some(key => {
          let a = get(item.dataObject, key),
            b = queryText;
          if (!casesensitive) {
            a = toLower(toString(a));
            b = toLower(toString(b));
          }
          return this.applyFilter(a, b);
        });
      });
    } else {
      // local search on data with array of objects.
      // Iterate over each item and return the filtered data containing the matching string.
      if (isArray(entries) && isObject(entries[0])) {
        filteredData = filter(entries, (entry: any) => {
          let a = isString(entry.dataObject) ? entry.dataObject : values(entry.dataObject).join(' ');
          if (!casesensitive) {
            a = toLower(a);
            queryText = toLower(queryText);
          }
          return this.applyFilter(a, queryText);
        });
      } else {
        filteredData = filter(entries, (entry: any) => {
          if (!casesensitive) {
            entry = toLower(entry);
            queryText = toLower(queryText);
          }
          return this.applyFilter(entry, queryText);
        });
      }
    }
    return filteredData;

  }
}
