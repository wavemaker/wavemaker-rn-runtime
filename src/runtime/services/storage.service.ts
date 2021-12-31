import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  get(key: string, callback?: (error?: Error, result?: string) => void): Promise<string | null> {
    return AsyncStorage.getItem(key, callback);
  }
  set(key: string, value: string, callback?: (error?: Error) => void): Promise<void> {
    return AsyncStorage.setItem(key, value, callback);
  }
  remove(key: string, callback?: (error?: Error) => void): Promise<void> {
    return AsyncStorage.removeItem(key, callback);
  }
}

export default new StorageService();
