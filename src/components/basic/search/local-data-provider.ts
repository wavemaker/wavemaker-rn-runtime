import { filter, includes, values, isNumber, split, toLower, get, toString, isArray, isObject, isString } from 'lodash';

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
