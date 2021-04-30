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