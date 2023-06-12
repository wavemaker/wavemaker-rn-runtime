import { keys, sortBy } from 'lodash-es';
import { logger } from 'react-native-logs';
import StorageService from './storage.service'

class LoggerCollection {
    loggerMap = new Map<string, Logger>();
    config = {} as any;
    key = 'wm.log.config';

    init() {
        StorageService.getItem(this.key).then((data) => {
            if (data) {
                this.config = JSON.parse(data as string) || {};
                keys(this.config).forEach((k: string) => {
                    this.loggerMap.get(k)?.setLevel(this.config[k].level);
                });
            }
        }).catch(() => {});
    }

    get(name: string) {
        return this.loggerMap.get(name);
    }

    set(name: string, logger: Logger) {
        this.loggerMap.set(name, logger);
    }

    setLogLevel(name?: string, level?: string) {
        if (!level && (name && levels[name] !== undefined)) {
            level =  name;
            name = undefined;
        }
        if (level !== undefined) {
            [...this.loggerMap.keys()]
                .filter(k => !name || k.startsWith(name))
                .forEach(k => {
                    level && this.loggerMap.get(k)?.setLevel(level);
                    if (k) {
                        this.config[k] =  this.config[k] || {};
                        this.config[k].level = level;
                    } 
                });
                StorageService.setItem(this.key, JSON.stringify(this.config))
        }
    }

    getLogLevel(name?: string, level?: string) {
        return name && this.config[name]?.level;
    }

    list() {
        return sortBy([...this.loggerMap.keys()])
    }
}

const levels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
} as any;

const loggerCollection = new LoggerCollection();

const log = logger.createLogger({
    severity: 'debug',
    levels: levels,
    enabledExtensions: []
});

export class Logger {

    private ins = null as any;

    constructor(private name: string, private level: string) {
        this.ins = log.extend(this.name);
        log.enable(this.name);
    }

    private isEnabled(level: string) {
        return levels[level] >= levels[this.level];
    }

    private log(level: string, msg: string | Function ) {
        if (this.isEnabled(level)) {
            if (msg instanceof Function) {
                msg = msg();
            }
            this.ins[level](msg);
        }
    }

    extend(name: string) {
        return getLogger(this.name + '.' + name);
    }

    setLevel(level: string) {
        this.level = level;
    }

    debug(msg: string | Function) {
        this.log('debug', msg);
    }

    info(msg: string | Function) {
        this.log('info', msg);
    }

    warn(msg: string | Function) {
        this.log('warn', msg);
    }

    error(msg: string | Function) {
        this.log('error', msg);
    }
}

const getLogger = (name: string, level?: string) => {
    let logger = loggerCollection.get(name);
    if (!logger) {
        logger = new Logger(name, loggerCollection.getLogLevel(name) || 'error');
        loggerCollection.set(name, logger);
    }
    return logger;
};

export const ROOT_LOGGER = getLogger('root');
export const PERFORMANCE_LOGGER = ROOT_LOGGER.extend('performance');
export const RENDER_LOGGER = PERFORMANCE_LOGGER.extend('render');

export default {
    get: getLogger,
    setLogLevel: (name?: string, level?: string) => loggerCollection.setLogLevel(name, level),
    list: () => loggerCollection.list(),
    reset: () => loggerCollection.setLogLevel('root', 'error'),
    init: () => loggerCollection.init()
};