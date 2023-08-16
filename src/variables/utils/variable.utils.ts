import { forEach, get, isNumber, isObject, isEqual, omit, keys } from "lodash";
/**
 * sets the value against passed key on the "inputFields" object in the variable
 * @param targetObj: the object in which the key, value is to be set
 * @param variable
 * @param key: can be:
 *  - a string e.g. "username"
 *  - an object, e.g. {"username": "john", "ssn": "11111"}
 * @param val
 * - if key is string, the value against it (for that data type)
 * - if key is object, not required
 * @param options
 * @returns {any}
 */

export const _setInput = (targetObj: any, key: any, val: any, options?: any) => {
  targetObj = targetObj || {};
  let keys,
    lastKey,
    paramObj: any = {};

  // content type check
  if (isObject(options)) {
    // @ts-ignore
    switch (options.type) {
      case 'file':
        //val = getBlob(val, options.contentType);
        break;
      case 'number':
        val = isNumber(val) ? val : parseInt(val, 10);
        break;
    }
  }

  if (isObject(key)) {
    // check if the passed parameter is an object itself
    paramObj = key;
  } else if (key.indexOf('.') > -1) {
    // check for '.' in key e.g. 'employee.department'
    keys = key.split('.');
    lastKey = keys.pop();
    // Finding the object based on the key
    targetObj = findValueOf(targetObj, keys.join('.'), true);
    key = lastKey;
    paramObj[key] = val;
  } else {
    paramObj[key] = val;
  }

  forEach(paramObj, function (paramVal, paramKey) {
    targetObj[paramKey] = paramVal;
  });
  return targetObj;
}

/*
 * Util method to find the value of a key in the object
 * if key not found and create is true, an object is created against that node
 * Examples:
 * var a = {
 *  b: {
 *      c : {
 *          d: 'test'
 *      }
 *  }
 * }
 * Utils.findValue(a, 'b.c.d') --> 'test'
 * Utils.findValue(a, 'b.c') --> {d: 'test'}
 * Utils.findValue(a, 'e') --> undefined
 * Utils.findValue(a, 'e', true) --> {} and a will become:
 * {
 *   b: {
 *      c : {
 *          d: 'test'
 *      }
 *  },
 *  e: {
 *  }
 * }
 */
export const findValueOf = (obj: any, key: any, create?: any) => {

  if (!obj || !key) {
    return;
  }

  if (!create) {
    return get(obj, key);
  }

  const parts = key.split('.'),
    keys: any = [];

  let skipProcessing;

  // @ts-ignore
  parts.forEach((part: any) => {
    if (!parts.length) { // if the part of a key is not valid, skip the processing.
      skipProcessing = true;
      return false;
    }

    const subParts = part.match(/\w+/g);
    let subPart;

    while (subParts.length) {
      subPart = subParts.shift();
      keys.push({ 'key': subPart, 'value': subParts.length ? [] : {} }); // determine whether to create an array or an object
    }
  });

  if (skipProcessing) {
    return undefined;
  }

  keys.forEach((_key: any) => {
    let tempObj = obj[_key.key];
    if (!isObject(tempObj)) {
      tempObj = getValidJSON(tempObj);
      if (!tempObj) {
        tempObj = _key.value;
      }
    }
    obj[_key.key] = tempObj;
    obj = tempObj;
  });

  return obj;
};

export const getValidJSON = (content: any) => {
  if (!content) {
    return undefined;
  }
  try {
    const parsedIntValue = parseInt(content, 10);
    /*obtaining json from editor content string*/
    return isObject(content) || !isNaN(parsedIntValue) ? content : JSON.parse(content);
  } catch (e) {
    /*terminating execution if new variable object is not valid json.*/
    return undefined;
  }
}

export const parseErrors = (errors: any) => {
  let errMsg = '';
  if (errors && errors.error && errors.error.length) {
      errors.error.forEach((errorDetails: any, i: number) => {
          errMsg += parseError(errorDetails) + (i > 0 ? '\n' : '');
      });
  }
  return errMsg;
}

export const parseError = (errorObj: any) => {
  let errMsg;
  errMsg = errorObj.message ? replace(errorObj.message, errorObj.parameters, true) : ((errorObj.parameters && errorObj.parameters[0]) || '');
  return errMsg;
}

/*
 * Util method to replace patterns in string with object keys or array values
 * Examples:
 * Utils.replace('Hello, ${first} ${last} !', {first: 'wavemaker', last: 'ng'}) --> Hello, wavemaker ng
 * Utils.replace('Hello, ${0} ${1} !', ['wavemaker','ng']) --> Hello, wavemaker ng
 * Examples if parseError is true:
 * Utils.replace('Hello, {0} {1} !', ['wavemaker','ng']) --> Hello, wavemaker ng
 */
export const replace = (template: any, map: any, parseError?: boolean) => {
  let regEx = /\$\{([^\}]+)\}/g;
  if (!template) {
      return;
  }
  if (parseError) {
      regEx = /\{([^\}]+)\}/g;
  }

  return template.replace(regEx, function (match: any, key: any) {
      return get(map, key);
  });
};

/*Function to check whether the specified object is a pageable object or not.*/
export const isPageable = (obj: any): boolean => {
  const pageable = {
    content: [],
    first: true,
    last: true,
    number: 0,
    numberOfElements: 10,
    size: 20,
    sort: null,
    totalElements: 10,
    totalPages: 1
  };
  // paginated object may or may not contain 'empty' property. In either case, Pageable should return as true.
  const paginatedObj = omit(obj, 'empty');
  return isEqual(keys(pageable), keys(paginatedObj).sort());
};
