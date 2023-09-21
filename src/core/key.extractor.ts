export class DefaultKeyExtractor {
    store = new Map<any, string>();
    nextKey = 1;
  
    getKey(o : any, create = false) {
      let k = this.store.get(o);
      if (!k && create) {
        k = `key:${Date.now()}:${this.nextKey++}`;
        this.store.set(o, k)
      }
      return k;
    }
  
    clear() {
      this.store = new Map();
    }
}