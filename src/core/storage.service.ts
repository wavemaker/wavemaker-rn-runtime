import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  public target = 'GLOBAL';

  private getKey(key: string) {
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
}

export default new StorageService();
