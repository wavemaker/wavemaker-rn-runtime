import { Platform } from 'react-native';
import { isString } from "lodash-es";
import moment from "moment";
import { includes, isUndefined, isNull, orderBy, groupBy, toLower, get, forEach, sortBy, cloneDeep, keys, values, isArray} from 'lodash';

declare const window: any;
const GROUP_BY_OPTIONS = {
  ALPHABET: 'alphabet',
  WORD: 'word',
  OTHERS: 'Others'
};
const TIME_ROLLUP_OPTIONS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
};

const _deepCopy = (o1: any, ...o2: any) => {
    o2.forEach((o: any) => {
        if (o) {
            Object.keys(o).forEach(k => {
                const v = o[k];
                if (v && !isString(v) && !isArray(v) && typeof v === 'object') {
                    o1[k] = _deepCopy(o1[k] || {}, o[k]);
                } else {
                    o1[k] = _deepCopy(v);
                }
            });
        }
    });
    return o1;
};

export const deepCopy = (...objects: any) => _deepCopy({}, ...objects);

/**
 * this method encodes the url and returns the encoded string
 */
 export const encodeUrl = (url: string): string => {
    let splits = url.split('#');
    const hash = splits[1];
    splits = splits[0].split('?');
    let params = '';
    if (splits.length > 1) {
        params = splits[1].split('&')
            .map(p => p.split('='))
            .map(p => p[0] +'=' + encodeURIComponent(p[1]))
            .join('&');
    }
    return encodeURI(splits[0]) + (params ? '?' + params: '') + (hash ? '#'+ hash : '');
};

export const isWebPreviewMode = () => !!(window && window.navigator && window.document);

export const widgetsWithUndefinedValue = ['checkbox', 'toggle'];

export const isAndroid = () => (Platform.OS === 'android' || (Platform.OS === 'web' && /android/i.test(window.navigator.userAgent)));

export const isIos = () => (Platform.OS === 'ios' || (Platform.OS === 'web' && /iPhone|iPad/i.test(window.navigator.userAgent)));

/**
 * This method prepares the grouped data.
 *
 * @param fieldDefs array of objects i.e. dataset
 * @param groupby string groupby
 * @param match string match
 * @param orderby string orderby
 * @param dateFormat string date format
 */
export const getGroupedData = (fieldDefs: any, groupby: string, match: string, orderby: string, dateFormat: string, innerItem?: any) => {
  // handling case-in-sensitive scenario
  // ordering the data based on groupby field. If there is innerItem then apply orderby using the innerItem's containing the groupby field.
  fieldDefs = orderBy(fieldDefs, fieldDef => {
    const groupKey = get(innerItem ? fieldDef[innerItem] : fieldDef, groupby);
    if (groupKey) {
      return toLower(groupKey);
    }
    return '';
  });

  // extract the grouped data based on the field obtained from 'groupDataByField'.
  const groupedLiData = groupBy(fieldDefs, function (fieldDef) {
    let concatStr = get(innerItem ? fieldDef[innerItem] : fieldDef, groupby);
    // by default set the undefined groupKey as 'others'
    if (isUndefined(concatStr) || isNull(concatStr) || concatStr.toString().trim() === '') {
      return GROUP_BY_OPTIONS.OTHERS;
    }
    // if match prop is alphabetic ,get the starting alphabet of the word as key.
    if (match === GROUP_BY_OPTIONS.ALPHABET) {
      concatStr = concatStr.substr(0, 1);
    }

    // if match contains the time options then get the concatStr using 'getTimeRolledUpString'
    if (includes(values(TIME_ROLLUP_OPTIONS), match)) {
      dateFormat = dateFormat && dateFormat.replace(/d/g, 'D');
      dateFormat = dateFormat && dateFormat.replace(/y/g, 'Y');
      concatStr = moment(concatStr).format(dateFormat);
    }

    return concatStr;
  });

  return getSortedGroupedData(groupedLiData, groupby, orderby, innerItem);
};

/**
 * function to get the ordered dataset based on the given orderby
 */
export const getOrderedDataset = (dataSet: any, orderby: string, innerItem?: any) => {
  if (!orderBy) {
    return cloneDeep(dataSet);
  }

  // The order by only works when the dataset contains list of objects.
  const items = orderby && orderby.split(','),
    fields: any = [],
    directions: any = [];
  items && items.forEach( obj => {
    const item = obj.split(':');
    fields.push(innerItem ? innerItem + '.' + item[0] : item[0]);
    directions.push(item[1]);
  });
  return orderBy(dataSet, fields, directions);
};


/**
 * This method returns sorted data based to groupkey.
 * Returns a array of objects, each object containing key which is groupKey and data is the sorted data which is sorted by groupby field in the data.
 *
 * @param groupedLiData, grouped data object with key as the groupKey and its value as the array of objects grouped under the groupKey.
 * @param groupBy, string groupby property
 * @returns {any[]}
 */
export const getSortedGroupedData = (groupedLiData: any, groupBy: string, orderby: string, innerItem?: any) => {
  const _groupedData: any = [];
  forEach(keys(groupedLiData), (groupkey, index) => {
    const liData = getOrderedDataset(groupedLiData[groupkey], orderby, innerItem);
    _groupedData.push({
      key: groupkey,
      data: sortBy(liData, data => {
        data._groupIndex = index;
        return get(data, groupBy) || get(data[innerItem], groupBy);
      })
    });
  });
  return _groupedData;
};
