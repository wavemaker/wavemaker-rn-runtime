import { isEqual as _isEqual, isArray, isObject, clone, reverse, sortBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { WIDGET_LOGGER } from '@wavemaker/app-rn-runtime/core/base.component';

const WATCH_LOGGER = WIDGET_LOGGER.extend("watch");

class Watcher {
    private last: any = null;
    private expBody: string = null as any;
    public lastExecutionTime = 0;

    constructor(private fn: Function, private onChange: (prev: any, now: any) => any) {
        this.last = this.execute();
        if (isArray(this.last)) {
            this.last = clone(this.last);
        }
    }

    private getExpBody() {
        if (!this.expBody) {
            const expStr = this.fn.toString();
            this.expBody = expStr.substring(
                expStr.indexOf('return ') + 7,
                expStr.lastIndexOf(';'));
        }
        return this.expBody;
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
        const isArrayObj = isArray($old) || isArray($new);
        if (isArrayObj) {
            if (($old && !$new) 
                || (!$old && $new)
                || $old.length !== $new.length) {
                return false;
            }
            for(let i = 0; i < $old.length; i++) {
                if ($old[i] !== $new[i]) {
                    return false;
                }
            }
        }
        if (isObject($old) || isObject($new)) {
            return true;
        }
        return $old === $new;
    }

    get value() {
        return this.last;
    }

    public check() {
        const start = Date.now();
        const now = this.execute();
        const changed = !this.isEqual(this.last, now);
        this.lastExecutionTime = Date.now() - start;
        if (changed) {
            WATCH_LOGGER.debug(() => {
                if (this.getExpBody() !== 'fragment') {
                    return `Watcher: <${this.getExpBody}> Changed from ${this.last} to ${now} `;
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
    public watchers = [] as Watcher[];
    public isActive = false;
    constructor(private isMuted = () => false) {}
    check() {
        this.isActive = !this.isMuted();
        if (this.isActive) {
            this.watchers.some(watcher => watcher.check());
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
        let watchers: Watcher[] = [];
        this.store.forEach(watcherGroup => {
            watcherGroup.check();
            if (watcherGroup.isActive) {

                watchers.push(...watcherGroup.watchers);
            }
        });
        const totalTime = Date.now() - start;
        if (totalTime > 1000) {
            watchers = reverse(sortBy(watchers, w => w.lastExecutionTime));
            //console.log('watchers %O', watchers);
        }
        WATCH_LOGGER.info(`Watch Cycle took ${totalTime} ms.`);
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
            const watcher =  new Watcher(fn, () => setTimeout(() => onChange({})));
            watcherGroup.add(watcher);
            return watcher.value;
        }
    };
};