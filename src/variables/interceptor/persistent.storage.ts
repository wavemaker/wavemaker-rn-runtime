import { StorageService } from "@wavemaker/variables/src/interceptor";
import asyncStorageService from "@wavemaker/app-rn-runtime/core/storage.service";

let KEYS_STORED = {} as Record<string, boolean>;

export type CacheEntry = {
    key: string,
    value: any,
    createdAt: number,
    lastAccessedAt: number,
    ttl: number
};

const PERSISTANT_STORAGE_KEYS = "PERSISTANT_STORAGE_KEYS";

export class PersistentStorageService implements StorageService {

    private constructor(private keyPrefix: string) {

    }

    static addKey(key: string) {
        KEYS_STORED[key] = true;
        asyncStorageService.setItem(PERSISTANT_STORAGE_KEYS, JSON.stringify(KEYS_STORED));
    }

    static removeKey(key: string) {
        delete KEYS_STORED[key];
        asyncStorageService.setItem("PERSISTANT_STORAGE_KEYS", JSON.stringify(KEYS_STORED));
    }

    getKey(key: string) {
        return this.keyPrefix+ '_ps_' + key ;
    }

    public async setItem(key: string, value: any, ttl: number) {
        key = this.getKey(key);
        await asyncStorageService.setItem(key, JSON.stringify({
            key,
            value,
            createdAt: Date.now(),
            lastAccessedAt: Date.now(),
            ttl: ttl && ttl > 0 ? Date.now() + ttl : undefined
        } as CacheEntry));
        PersistentStorageService.addKey(key);
    }

    public async getItem(key: string) {
        key = this.getKey(key);
        const entryStr = await asyncStorageService.getItem(key);
        if (entryStr) {
            const entry = JSON.parse(entryStr);
            if (entry.ttl && entry.ttl < Date.now()) {
                await asyncStorageService.removeItem(key);
                return;
            }
            await asyncStorageService.setItem(key, JSON.stringify({
                ...entry,
                lastAccessedAt: Date.now()
            } as CacheEntry));
            return entry.value;
        }
        return undefined;
    }

    public async removeItem(key: string) {
        await asyncStorageService.removeItem(this.getKey(key));
    }

    public async clear() {
        return Promise.all(Object.keys(KEYS_STORED).map(async (key) => {
            await asyncStorageService.removeItem(this.getKey(key));
        }));
    }

    static getInstance(keyPrefix: string) {
        return new PersistentStorageService(keyPrefix);
    }

    static cleanEntriesWithExpiredTTL() {
        return Promise.all(Object.keys(KEYS_STORED).map(async (key) => {
            const entryStr = await asyncStorageService.getItem(key);
            if (entryStr) {
                const entry = JSON.parse(entryStr);
                if (entry.ttl && entry.ttl < Date.now()) {
                    await asyncStorageService.removeItem(key);
                    PersistentStorageService.removeKey(key);
                }
            }
        }));
    }

    static async init() {
        KEYS_STORED = JSON.parse(await asyncStorageService.getItem(PERSISTANT_STORAGE_KEYS) || '{}');
    }

    static scheduleTTLCleanup(interval = 60 * 1000) {
        setInterval(PersistentStorageService.cleanEntriesWithExpiredTTL, interval);
    }
}
