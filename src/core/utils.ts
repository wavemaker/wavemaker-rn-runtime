import { Platform } from 'react-native'; 
import { isString } from "lodash-es";

declare const window: any;

const _deepCopy = (o1: any, ...o2: any) => {
    o2.forEach((o: any) => {
        if (o) {
            Object.keys(o).forEach(k => {
                const v = o[k];
                if (v && !isString(v) && typeof v === 'object') {
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
