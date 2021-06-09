const map = new Map<string, any>();

const get = <T>(t :string): T => {
    return map.get(t) as T;
};

const set = <T>(t :string, o: T) => {
    map.set(t, o);
};

export default {
    set: set,
    get: get
};