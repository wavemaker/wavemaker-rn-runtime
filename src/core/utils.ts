import { Platform } from 'react-native';
import moment from "moment";
import * as FileSystem from "expo-file-system";
import { isFunction, includes, isUndefined, isNull, orderBy, groupBy, toLower, get, forEach, sortBy, cloneDeep, keys, values, isArray, isString, isNumber } from 'lodash';
import * as mime from 'react-native-mime-types';
import ThemeVariables from '../styles/theme.variables';

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

type LayoutData = {
  [index: string]: {
    [index: string]: {
      x: number,
      y: number
    }
  }
}

const AppLayoutPosition: { currentPage: string, data: LayoutData } = {
  currentPage: 'Main',
  data: {}
}

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

export const toBoolean = (val: any) => {
  return val === true
    || val === 'true'
    || !(val === false
      || val === null
      || val === undefined
      || val === '');
};

export const toNumber = (val: any) => {
  try {
    return parseFloat(val) || 0;
  } catch (e) {
    return 0;
  }
};

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
      .map(p => p[0] + '=' + encodeURIComponent(p[1]))
      .join('&');
  }
  return encodeURI(splits[0]) + (params ? '?' + params : '') + (hash ? '#' + hash : '');
};

export const isWebPreviewMode = () => Platform.OS === 'web';

export const isDevMode = () => isWebPreviewMode() || __DEV__;

export const widgetsWithUndefinedValue = ['checkbox', 'toggle'];

export const isAndroid = () => (Platform.OS === 'android' || (Platform.OS === 'web' && /android/i.test(window.navigator.userAgent)));

export const isIos = () => (Platform.OS === 'ios' || (Platform.OS === 'web' && /iPhone|iPad/i.test(window.navigator.userAgent)));

const getGroupKey = (fieldDef: any, groupby: string, widgetScope: any, innerItem?: any) => isFunction(groupby) ? groupby.apply(widgetScope.proxy, [innerItem ? fieldDef[innerItem] : fieldDef]) : get(innerItem ? fieldDef[innerItem] : fieldDef, groupby);

/**
 * This method prepares the grouped data.
 *
 * @param fieldDefs array of objects i.e. dataset
 * @param groupby string groupby
 * @param match string match
 * @param orderby string orderby
 * @param dateFormat string date format
 */
export const getGroupedData = (fieldDefs: any, groupby: string, match: string, orderby: string, dateFormat: string, widgetScope: any, innerItem?: any) => {

  // handling case-in-sensitive scenario
  // ordering the data based on groupby field. If there is innerItem then apply orderby using the innerItem's containing the groupby field.
  fieldDefs = orderBy(fieldDefs, fieldDef => {
    const groupKey = getGroupKey(fieldDef, groupby, widgetScope, innerItem);
    if (groupKey) {
      return toLower(groupKey);
    }
    return '';
  });

  // extract the grouped data based on the field obtained from 'groupDataByField'.
  const groupedLiData = groupBy(fieldDefs, function (fieldDef) {
    let concatStr = getGroupKey(fieldDef, groupby, widgetScope, innerItem);
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
  items && items.forEach(obj => {
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

export const isDefined = (v: any) => typeof v !== 'undefined';

// try to convert the chekedvalue and unchecked values to boolean/number
export const unStringify = (val: any, defaultVal?: boolean) => {
  if (val === null) {
    return defaultVal;
  }

  if (val === true || val === 'true') {
    return true;
  }

  if (val === false || val === 'false') {
    return false;
  }

  const number = parseInt(val, 10);
  if (!isNaN(number)) {
    return number;
  }
  return val;
};

/**
 * This function invokes the given the function (fn) until the function successfully executes or the maximum number
 * of retries is reached or onBeforeRetry returns false.
 *
 * @param fn - a function that is needs to be invoked. The function can also return a promise as well.
 * @param interval - minimum time gap between successive retries. This argument should be greater or equal to 0.
 * @param maxRetries - maximum number of retries. This argument should be greater than 0. For all other values,
 * maxRetries is infinity.
 * @param onBeforeRetry - a callback function that will be invoked before re-invoking again. This function can
 * return false or a promise that is resolved to false to stop further retry attempts.
 * @returns {*} a promise that is resolved when fn is success (or) maximum retry attempts reached
 * (or) onBeforeRetry returned false.
 */
export const retryIfFails = (fn: Function, interval: number, maxRetries: number, onBeforeRetry = () => Promise.resolve(false)) => {
  let retryCount = 0;
  const tryFn = () => {
    retryCount++;
    if (isFunction(fn)) {
      return fn();
    }
  };
  maxRetries = (isNumber(maxRetries) && maxRetries > 0 ? maxRetries : 0);
  interval = (isNumber(interval) && interval > 0 ? interval : 0);
  return new Promise((resolve, reject) => {
    const errorFn = function () {
      const errArgs = arguments;
      setTimeout(() => {
        Promise.resolve().then(() => onBeforeRetry()).then(function (retry) {
          if (retry !== false && (!maxRetries || retryCount <= maxRetries)) {
            Promise.resolve().then(() => tryFn()).then(resolve, errorFn);
          } else {
            reject(errArgs);
          }
        }, () => reject(errArgs));
      }, interval);
    };
    Promise.resolve().then(() => tryFn()).then(resolve, errorFn);
  });
};

/**
 * Promise of a defer created using this function, has abort function that will reject the defer when called.
 * @returns {*} angular defer object
 */
export const getAbortableDefer = () => {
  const _defer: any = {
    promise: null,
    reject: null,
    resolve: null,
    onAbort: () => { },
    isAborted: false
  };
  _defer.promise = new Promise((resolve, reject) => {
    _defer.resolve = resolve;
    _defer.reject = reject;
  });
  _defer.promise.abort = () => {
    _defer.onAbort && _defer.onAbort();
    _defer.reject('aborted');
    _defer.isAborted = true;
  };
  return _defer;
};

export const validateField = (props: any, value: any) => {
  let requiredCheck = true, regexCheck = true;
  if (props.required) {
    if (isArray(value)) {
      requiredCheck = value.length === 0 ? false : true
    } else {
      requiredCheck = !value ? false : true
    }
    if (!requiredCheck) {
      return {
        errorType: 'required',
        isValid: false
      }
    }
  }
  if (value && props.regexp) {
    const condition = new RegExp("^" + props.regexp + "$", 'g');
    regexCheck = condition.test(value);
    if (!regexCheck) {
      return {
        errorType: 'regexp',
        isValid: false
      }
    }
  }
  if (value && props.maxchars && value.length > props.maxchars) {
    return {
      errorType: 'maxchars',
      isValid: false
    }

  }
  if (value && props.mindate && new Date(props.datavalue) < moment(props.mindate).startOf('day').toDate()) {
    return {
      errorType: 'mindate',
      isValid: false
    }
  }
  if (value && props.maxdate && new Date(props.datavalue) > moment(props.maxdate).endOf('day').toDate()) {
    return {
      errorType: 'maxdate',
      isValid: false
    }
  }

  return {
    isValid: true
  }
};

export const countDecimalDigits = (number: number | string) => {
  if (!number) return 0;

  // * convert the number to a string
  const numberString = number.toString();

  // * regular expression to match and count the decimal digits
  const decimalMatch = numberString.match(/\.(\d+)/);

  if (decimalMatch) {
    const decimalDigits = decimalMatch[1];
    return decimalDigits.length;
  } else {
    return 0; // * no decimal digits found
  }
}

export const formatCompactNumber = (number: number) => {
  const isNegative = number < 0;
  number = isNegative ? number * -1 : number;
  let formattedNumber = number + '';
  if (number >= 1000 && number < 1_000_000) {
    formattedNumber = (number / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (number >= 1_000_000 && number < 1_000_000_000) {
    formattedNumber = (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
    formattedNumber = (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
    formattedNumber = (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "T";
  }
  return (isNegative ? '-' : '') + formattedNumber;
}

export const toBase64 = function (path: string) {
  return FileSystem.readAsStringAsync(path, { encoding: 'base64' });
};

const DATASET_WIDGETS = new Set(['select', 'checkboxset', 'radioset', 'switch', 'autocomplete', 'chips', 'typeahead', 'rating']);
export const isDataSetWidget = (widget: any) => {
  return DATASET_WIDGETS.has(widget);
};
export const isFullPathUrl = (url: string) => {
  return isString(url) &&
    (url.startsWith('data:')
      || url.startsWith('http:')
      || url.startsWith('https:')
      || url.startsWith('file:'));
};

export function removeUndefinedKeys(obj: any) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (typeof obj[key] === 'object') {
      // * if the value is an object, recursively call the function
      removeUndefinedKeys(obj[key]);
    }
  }

  return obj;
}
// * get total number of days in a month of a year
export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

export const getDates = (
  startDate: number,
  endDate: number,
  month = 0, // zero-based
  year = new Date().getFullYear(),
) => {
  const daysInMonth = getDaysInMonth(month, year);
  const dates = Array.from({ length: daysInMonth }, (v, i) => i + 1);

  const datesInRange = dates.filter(date => date >= startDate && date <= endDate);

  return datesInRange;
};

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getMonths = (startMonth: number, endMonth: number) => {
  const months = monthNames.map(name => name.substring(0, 3));
  const monthRange = months.filter((_, index) => index >= startMonth && index <= endMonth);

  return monthRange;
};

export const getMonthIndex = (monthName: string, shortName: boolean = true) => {
  const months = shortName ? monthNames.map(name => name.substring(0, 3)) : monthNames;
  const monthNumber = months.findIndex((name) => name === monthName);

  return monthNumber;
}

export const getYearRange = (
  startYear: number = 1950,
  endYear: number = 2060,
) => {
  const years = [];
  for (let year = startYear; year <= endYear; ++year) {
    years.push(year);
  }

  return years;
};

export const getDateObject = (date: number, month: number, year: number) => {
  // * month is zero-based
  return new Date(year, month, date);
};

export const getHours = () => {
  const hours = [];
  for (let hour = 1; hour <= 12; ++hour) {
    const paddedHour = String(hour).padStart(2, '0');
    hours.push(paddedHour);
  }

  return hours;
}

export const get24Hours = () => {
  const hours = [];
  for (let hour = 0; hour <= 23; ++hour) {
    const paddedHour = String(hour).padStart(2, '0');
    hours.push(paddedHour);
  }

  return hours;
}

export const getMinutes = () => {
  const minutes = [];
  for (let minute = 0; minute <= 59; ++minute) {
    const paddedMinute = String(minute).padStart(2, '0');
    minutes.push(paddedMinute);
  }

  return minutes;
}

export const getTimeIndicators = () => {
  return ['AM', 'PM'];
}

export const getDateTimeObject = (date: number, month: number, year: number, hour: number, minute: number) => {
  // * month is zero-based
  return new Date(year, month, date, hour, minute);
};

export const getProgressBarGradientStartEnd = (angle: string) => {
  const angleLowerCase = angle?.toLowerCase();
  let start = { x: 0, y: 1 };
  let end = { x: 1, y: 1 };

  if (angle === '0deg' || angleLowerCase === 'to top') {
    end.x = 0;
    end.y = 0;
  } else if (angle === '90deg' || angleLowerCase === 'to right') {
    start.x = 0;
  } else if (angle === '180deg' || angleLowerCase === 'to bottom') {
    start.y = 0;
    end.x = 0;
    end.y = 1;
  } else if (angle === '270deg' || angleLowerCase === 'to left') {
    start.x = 1;
    end.x = 0;
  } else {
    // other angle
  }

  return {start, end}
}

export const parseProgressBarLinearGradient = (gradient: string) => {
  let angle = '', color1 = '', color2 = '';
  const linearGradientRegex = /linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/;
  const hasLinearGradient = linearGradientRegex.test(gradient);

  const matches = gradient?.match(linearGradientRegex);
  angle = matches?.[1] || '90deg';
  const {start, end} = getProgressBarGradientStartEnd(angle)
  color1 = matches?.[2] || ThemeVariables.INSTANCE.primaryColor;
  color2 = matches?.[3] || ThemeVariables.INSTANCE.primaryColor;

  return {hasLinearGradient, color1, color2, start, end};
}



export const extractGradientDirection = (gradientString: string): string => {
  // Check if the gradient string contains a direction or angle
  const directionMatch = gradientString.match(/linear-gradient\s*\(\s*((?:to\s+(?:top|bottom|left|right)(?:\s+(?:left|right))?|[0-9]+(?:deg|grad|rad|turn)))/i);
  
  // Return the direction if found, otherwise return default '90deg'
  return directionMatch ? directionMatch[1] : '90deg';
};

export const getGradientStartEnd = (direction: string) => {
  const directionLowerCase = direction?.toLowerCase();
  
  // Default values (to right / 90deg)
  let start = { x: 0, y: 0 };
  let end = { x: 1, y: 0 };
  
  // Handle standard named directions and common angles first
  if (direction === '0deg' || directionLowerCase === 'to top') {
    start = { x: 0, y: 1 };
    end = { x: 0, y: 0 };
  } else if (direction === '90deg' || directionLowerCase === 'to right') {
    start = { x: 0, y: 0 };
    end = { x: 1, y: 0 };
  } else if (direction === '180deg' || directionLowerCase === 'to bottom') {
    start = { x: 0, y: 0 };
    end = { x: 0, y: 1 };
  } else if (direction === '270deg' || directionLowerCase === 'to left') {
    start = { x: 1, y: 0 };
    end = { x: 0, y: 0 };
  } else if (direction === '45deg' || directionLowerCase === 'to top right') {
    start = { x: 0, y: 1 };
    end = { x: 1, y: 0 };
  } else if (direction === '135deg' || directionLowerCase === 'to bottom right') {
    start = { x: 0, y: 0 };
    end = { x: 1, y: 1 };
  } else if (direction === '225deg' || directionLowerCase === 'to bottom left') {
    start = { x: 1, y: 0 };
    end = { x: 0, y: 1 };
  } else if (direction === '315deg' || directionLowerCase === 'to top left') {
    start = { x: 1, y: 1 };
    end = { x: 0, y: 0 };
  } else if (direction.match(/\d+(?:deg|grad|rad|turn)$/)) {
    // Handle custom angles
    let angleInDegrees = 0;
    
    if (direction.endsWith('deg')) {
      angleInDegrees = parseFloat(direction);
    } else if (direction.endsWith('grad')) {
      // 1 grad = 0.9 degrees
      angleInDegrees = parseFloat(direction) * 0.9;
    } else if (direction.endsWith('rad')) {
      // 1 rad = 180/π degrees
      angleInDegrees = parseFloat(direction) * (180 / Math.PI);
    } else if (direction.endsWith('turn')) {
      // 1 turn = 360 degrees
      angleInDegrees = parseFloat(direction) * 360;
    }
    
    // Normalize angle to [0, 360)
    angleInDegrees = ((angleInDegrees % 360) + 360) % 360;
    
    // Convert angle to radians for calculations
    // Note: CSS angles follow the polar coordinate system where 0deg points up (north)
    // and increases clockwise. We adjust by adding 270 to match this convention.
    const adjustedAngle = ((angleInDegrees + 270) % 360) * (Math.PI / 180);
    
    // Calculate end point on a unit circle
    const endX = Math.cos(adjustedAngle);
    const endY = Math.sin(adjustedAngle);
    
    // Normalize to ensure the vector length is correct and fits in our coordinate system
    const vectorLength = Math.sqrt(endX * endX + endY * endY);
    
    // Set start at center point (0.5, 0.5) and calculate end point
    start = { 
      x: 0.5 - (endX / vectorLength) * 0.5,
      y: 0.5 - (endY / vectorLength) * 0.5
    };
    
    end = { 
      x: 0.5 + (endX / vectorLength) * 0.5, 
      y: 0.5 + (endY / vectorLength) * 0.5 
    };
  }
  
  return { start, end };
};

export const getGradientColorStops = (gradientString: string): number[] => {
  // Check if input is valid
  if (!gradientString) return [];
  
  // Extract the content inside linear-gradient()
  const match = gradientString.match(/linear-gradient\s*\((.*)\)/);
  if (!match) return [];
  
  const content = match[1];
  
  // Remove angle/direction part if present
  const withoutDirection = content.replace(/^(to\s+\w+(?:\s+\w+)?|[0-9]+(?:deg|grad|rad|turn))\s*,\s*/, '');
  
  // Split by commas that are not inside parentheses
  let depth = 0;
  let currentSegment = '';
  const segments = [];
  
  for (let i = 0; i < withoutDirection.length; i++) {
    const char = withoutDirection[i];
    
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      segments.push(currentSegment.trim());
      currentSegment = '';
      continue;
    }
    
    currentSegment += char;
  }
  
  // Don't forget the last segment
  if (currentSegment.trim()) {
    segments.push(currentSegment.trim());
  }
  
  // Check if any segments have percentages
  const hasPercentages = segments.some(segment => {
    return segment.match(/^(?:rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+)\s+\d+(?:\.\d+)?%$/);
  });
  
  // If no percentages are defined, return an empty array
  if (!hasPercentages) return [];
  
  // Parse each segment into color and position
  const colorStops = segments.map((segment, index) => {
    // Match color and optional percentage position
    const match = segment.match(/^(?:rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+)(?:\s+(\d+(?:\.\d+)?)%)?$/);
    
    if (match && match[1]) {
      // If percentage is present, convert to decimal (0-1)
      const percentage = parseFloat(match[1]);
      return Math.max(0, Math.min(percentage / 100, 1)); // Clamp between 0 and 1
    } else {
      // If no percentage, calculate based on position
      return segments.length > 1 ? index / (segments.length - 1) : 0;
    }
  });
  
  //expo linear gradient location props ascendng order validation
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (colorStops[i] < colorStops[i - 1]) {
      return []; // Invalid: not in ascending order return empty array
    }
  }
  return colorStops;
};

export const getGradientColors = (gradientString: string): string[] => {
  // Check if input is valid
  if (!gradientString) return [];
  
  // Extract the content inside linear-gradient()
  const match = gradientString.match(/linear-gradient\s*\((.*)\)/);
  if (!match) return [];
  
  const content = match[1];
  
  // Remove angle/direction part if present
  const withoutDirection = content.replace(/^(to\s+\w+(?:\s+\w+)?|[0-9]+(?:deg|grad|rad|turn))\s*,\s*/, '');
  
  // Split by commas that are not inside parentheses
  let depth = 0;
  let currentSegment = '';
  const segments = [];
  
  for (let i = 0; i < withoutDirection.length; i++) {
    const char = withoutDirection[i];
    
    if (char === '(') depth++;
    else if (char === ')') depth--;
    else if (char === ',' && depth === 0) {
      segments.push(currentSegment.trim());
      currentSegment = '';
      continue;
    }
    
    currentSegment += char;
  }
  
  // Don't forget the last segment
  if (currentSegment.trim()) {
    segments.push(currentSegment.trim());
  }
  
  // Extract just the color part from each segment
  return segments.map(segment => {
    const match = segment.match(/^((?:rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8}|\w+))/);
    return match ? match[1] : segment;
  });
};



export const parseLinearGradient = (gradient: string)   => {
  // Check if this is a valid linear gradient
  const hasLinearGradient = /linear-gradient\s*\(/i.test(gradient);
  
  if (!hasLinearGradient || !gradient)  return{
    hasLinearGradient: false,
    color1: '',
    color2: '',
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
    gradientColors: [],
    colorStops: []
  }
  
  // Extract direction/angle
  const direction = extractGradientDirection(gradient);
  
  // Get start and end points
  const { start, end } = getGradientStartEnd(direction);
  
  // Get colors
  let gradientColors = getGradientColors(gradient);
  
  // Get color stops in the format [[0, 0.5], [0.5, 1]]
  const colorStops = getGradientColorStops(gradient);
  
  // For backward compatibility, extract color1 and color2
  const color1 = gradientColors.length > 0 ? gradientColors[0] : ThemeVariables?.INSTANCE?.primaryColor || '#000000';
  const color2 = gradientColors.length > 1 ? gradientColors[gradientColors.length - 1] : color1;

  const defaultColor = ThemeVariables?.INSTANCE?.primaryColor

  gradientColors = gradientColors.length >= 2 ? gradientColors : [defaultColor,defaultColor]
 
  return { 
    hasLinearGradient, 
    color1, 
    color2, 
    start, 
    end, 
    gradientColors,
    colorStops,
  };
};

export const validateInputOnDevice = (value: string, type: 'number' | 'currency') => {
  const isCurrencyField = type === 'currency';
  let isValidText = true;
  let validText = value;

  // * no alphabets except E, may contain E only once
  if (/[a-df-zA-DF-Z]/.test(value) || !/^[^eE]*[eE]?[^eE]*$/.test(value)) {
    isValidText = false;
    validText = validText.replace(/[a-df-zA-DF-Z]/g, '');
    validText = validText.replace(/([eE])\1+/g, 'e');
  }

  // * currency only: check for negative number
  if (isCurrencyField && (Number(value) < 0 || /-/g.test(value))) {
    isValidText = false;
    validText = validText.replace(/-/g, '');
  }

  // * number only: not more than one minus and doesn't end with minus (-)
  if (!isCurrencyField && (Number(value.match(/-/g)?.length) > 1) || /\w-/.test(value)) {
    isValidText = false;
    validText = validText.replace(/-/g, '');
    validText = validText.replace(/\w-/g, '');
  }

  // * check for more than one decimal point
  if (/^\d*\.\d*\..*$/.test(value)) {
    isValidText = false;
    validText = validText.replace(/\.(?=\.*\.)/g, '');
  }

  // * check for spaces and comma
  if (/[\s,]/.test(value)) {
    isValidText = false;
    validText = validText.replace(/[\s,]/, '');
  }

  return { isValidText, validText };
}

export const isDateFormatAsPerPattern = (
  datePattern?: string,
  dateString?: string | Date
) => {
  try {
    // * format dateString as per datePattern
    const date = moment(dateString, datePattern, true);

    // * check date is valid and matches the format
    return date.isValid() && typeof dateString === 'string' && dateString?.toUpperCase() === date.format(datePattern)?.toUpperCase();
  } catch (error) {
    // * if not able to parse date string
    return false;
  }
};

export const getMimeType = (extensions?: string) => {
  if (!extensions) return '*/*';
  let hasInvalidExtension = false;
  let wildCards = ['image/*', 'audio/*', 'video/*'];
  let extensionList = extensions.split(' ');
  let mimeType = extensionList
    .map((extension: string) => {
      let type = mime.lookup(extension);
      let isWildCardExtension = wildCards.includes(extension);
      // * invalid extension, also not in wildcards
      hasInvalidExtension = !type && !isWildCardExtension;
      return type ? type : isWildCardExtension ? extension : '';
    })
    .filter((type) => type);

  if (hasInvalidExtension) return '*/*';
  return mimeType;
};

export function getNumberOfEmptyObjects(noOfItems: number) {
  return Array.from({ length: noOfItems }, () => ({}));
}

export const setPosition = (data: { [index: string]: { x: number, y: number } }): void => {
  Object.keys(data).forEach((key: string): void => {
    AppLayoutPosition.data[AppLayoutPosition.currentPage][key] = data[key]
  })
}

export const getPosition = (key: string): { x: number, y: number } => {
  return AppLayoutPosition.data[AppLayoutPosition.currentPage][key];
}

export const setCurrentPageInAppLayout = (pageName: string): void => {
  AppLayoutPosition.currentPage = pageName;
  AppLayoutPosition.data[pageName] = {};
}
