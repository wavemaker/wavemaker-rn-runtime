const map = new Map<string, any>();

const get = <T>(t :string): T => {
    return map.get(t) as T;
};

const set = <T>(t :string, o: T) => {
    map.set(t, o);
};

const remove =  <T>(t :string): T => {
    const v = map.get(t) as T;
    v && map.delete(t);
    return v;
};

const getInstance = <T>(key: string) => {
    return {
        set: (o: T) => set(key, o),
        get: () => get(key) as T,
        remove: () => remove(key) as T
    }
};
export default {
    set: set,
    get: get,
    remove: remove,
    FOCUSED_ELEMENT: getInstance<any>('FOCUSED_ELEMENT')
};