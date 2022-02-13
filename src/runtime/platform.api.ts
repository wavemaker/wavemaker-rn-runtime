import log from '@wavemaker/app-rn-runtime/core/logger';
import { Watcher } from './watcher';

export default {
    log: log,
    watchers: Watcher.ROOT
};