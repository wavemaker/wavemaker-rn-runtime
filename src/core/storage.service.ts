import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  public target = 'GLOBAL';

  protected getKey(key: string) {
    return `${this.target}_${key}`;
  }
  
  getItem(key: string, callback?: (error?: Error | null, result?: string | null) => void): Promise<string | null> {
    return AsyncStorage.getItem(this.getKey(key), callback);
  }
  setItem(key: string, value: string, callback?: (error?: Error | null) => void): Promise<void> {
    return AsyncStorage.setItem(this.getKey(key), value, callback);
  }
  removeItem(key: string, callback?: (error?: Error | null) => void): Promise<void> {
    return AsyncStorage.removeItem(this.getKey(key), callback);
  }

  async getAll() {
    const keys = await AsyncStorage.getAllKeys();
    const entries = await Promise.all(keys.map(async k => {
      const v = await AsyncStorage.getItem(k);
      return {
        key: k,
        value: v
      };
    }));
    const o = {} as any;
    entries.forEach((e) => {
      o[e.key] = e.value;
    });
    return o;
  }
}

export default new StorageService();
