import { useEffect, useMemo, useState } from 'react';
import BaseFragment from './base-fragment.component';

class WatcherStore {
    nextWatcherKey = 1;
    store = new Map<string, any[]>();
    i = 0;

    getWatchers(key: string) {
        if(!this.store.has(key)) {
            this.store.set(key, []);
        }
        return this.store.get(key) as any;
    }

    clearWatchers(key: string) {
        const watchers = this.store.get(key);
        if (watchers) {
            watchers.splice(0, watchers.length);
        }
    }

    removeWatchers(key: string) {
        this.store.delete(key);
    }

    getNextWatcherKey() {
        return 'watcher'+ (this.nextWatcherKey++);
    }
}

const WACTHER_STORE = new WatcherStore();
export function useWatcher(fragment: BaseFragment<any, any>) {
    const [state, setState] = useState({});
    const watcherKey = useMemo(() => WACTHER_STORE.getNextWatcherKey(), []);
    WACTHER_STORE.clearWatchers(watcherKey);
    const watchers = WACTHER_STORE.getWatchers(watcherKey);
    useEffect(() => {
        const destroy = fragment.watch(watchers, () => setState({})); 
        return () => {
            WACTHER_STORE.removeWatchers(watcherKey);
            destroy();
        };;
    }, []);
    return {
        watch: (fn: Function) => {
            watchers.push(fn);
            return fragment.eval(fn);
        }
    };
};