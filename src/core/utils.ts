declare const window: any;
export function deepCopy(o1: any, ...o2: any) {
    if (typeof o1 !== 'object') {
        o1 = {};
    }
    o2.forEach((o: any) => {
        if (o) {
            Object.keys(o).forEach(k => {
                const v = o[k];
                if (v && typeof v === 'object') {
                    o1[k] = deepCopy(o1[k] || {}, o[k]);
                } else {
                    o1[k] = v;
                }
            });
        }
    });
    return o1;
}

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

export const isPreviewMode = () => !!(window && window.navigator);

export const widgetsWithUndefinedValue = ['checkbox', 'toggle'];
