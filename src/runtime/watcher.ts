import { isEqual as _isEqual, isArray, clone } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { WIDGET_LOGGER } from '@wavemaker/app-rn-runtime/core/base.component';

class Watcher {
    private last: any = null;

    constructor(private fn: Function, private onChange: (prev: any, now: any) => any) {
        this.last = this.execute();
        if (isArray(this.last)) {
            this.last = clone(this.last);
        }
    }
    
    private execute() {
        try {
            return this.fn();
        } catch(e) {
            //do nothing
            return null;
        }
    }

    private isEqual($old: any, $new: any) {
        if (!_isEqual($old, $new)) {
            return false;
        }
        if (!isArray($old)) {
            return true;
        }
        if ($old.length !== $new.length) {
            return false;
        }
        for(let i = 0; i < $old.length; i++) {
            if ($old[i] !== $new[i]) {
                return false;
            }
        }
        return true;
    }

    get value() {
        return this.last;
    }

    public check() {
        const now = this.execute();
        if (!this.isEqual(this.last, now)) {
            WIDGET_LOGGER.debug(() => {
                const expStr = this.fn.toString();
                const expBody = expStr.substring(
                    expStr.indexOf('return ') + 7,
                    expStr.lastIndexOf(';'));
                if (expBody !== 'fragment') {
                    return `Watcher: <${expBody}> Changed from ${this.last} to ${now} `;
                }
                return '';
            });
            this.onChange(this.last, now);
            this.last = now;
            if (isArray(this.last)) {
                this.last = clone(this.last);
            }
            return true;
        }
        return false;
    }
}

export class WatcherGroup {
    private watchers = [] as Watcher[];
    constructor(private isMuted = () => false) {}
    check() {
        if (!this.isMuted()) {
            this.watchers.forEach(watcher => watcher.check());
        }
    }
    add(watcher: Watcher) {
        this.watchers.push(watcher);
    }
    clear() {
        if (this.watchers.length) {
            this.watchers = [];
        }
    }
}

export const WatcherStore = new (class {
    nextWatcherKey = 1;
    store = new Map<string, WatcherGroup>();
    i = 0;

    get(key: string) {
        return this.store.get(key) as WatcherGroup;
    }

    clear(key: string) {
        const watcherGroup = this.store.get(key);
        if (watcherGroup) {
            watcherGroup.clear();
        }
    }

    remove(key: string) {
        this.store.delete(key);
    }

    getNextWatcherKey() {
        return 'watcher'+ (this.nextWatcherKey++);
    }

    trigger() {
        const start = Date.now();
        this.store.forEach(watcherGroup => watcherGroup.check());
        WIDGET_LOGGER.info(`Watch Cycle took ${Date.now() - start} ms.`);
    };
})();

export function useWatcher(isMuted = () => false) {
    const [change, onChange] = useState({});
    const watcherKey = useMemo(() => WatcherStore.getNextWatcherKey(), []);
    let watcherGroup = WatcherStore.get(watcherKey);
    if (!watcherGroup) {
        watcherGroup = new WatcherGroup(isMuted);
        WatcherStore.store.set(watcherKey, watcherGroup);
    }
    watcherGroup.clear();
    useEffect(() => { 
        return () => {
            WatcherStore.remove(watcherKey);
        };
    }, []);
    return {
        watch: (fn: Function) => {
            const watcher =  new Watcher(fn, () => onChange({}));
            watcherGroup.add(watcher);
            return watcher.value;
        }
    };
};