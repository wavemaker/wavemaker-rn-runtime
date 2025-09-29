import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { StorageService } from './storage.service';

export class SecureStorageService extends StorageService {
  async getItem(key: string, callback?: (error?: Error | null, result?: string | null) => void): Promise<string | null> {
    if (Platform.OS === 'web') {
      return super.getItem(key, callback);
    }
    try {
      const value = await SecureStore.getItemAsync(this.getKey(key));
      callback?.(null, value);
      return value;
    } catch (error) {
      console.error('Error getting secure item:', error);
      callback?.(error as Error, null);
      return null;
    }
  }

  async setItem(key: string, value: string, callback?: (error?: Error | null) => void): Promise<void> {
    if (Platform.OS === 'web') {
      return super.setItem(key, value, callback);
    }
    try {
      await SecureStore.setItemAsync(this.getKey(key), value);
      callback?.(null);
    } catch (error) {
      console.error('Error setting secure item:', error);
      callback?.(error as Error);
      throw error;
    }
  }

  async removeItem(key: string, callback?: (error?: Error | null) => void): Promise<void> {
    if (Platform.OS === 'web') {
      return super.removeItem(key, callback);
    }
    try {
      await SecureStore.deleteItemAsync(this.getKey(key));
      callback?.(null);
    } catch (error) {
      console.error('Error removing secure item:', error);
      callback?.(error as Error);
      throw error;
    }
  }

  async isSecureStorageAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      return await SecureStore.isAvailableAsync();
    } catch {
      return false;
    }
  }
}

export default new SecureStorageService();
