import { ServiceVariableInterceptor } from "./service-variable-interceptor";
import { ServiceVariableContext } from "./intercept-context.impl";
import { Interceptor, interceptorManager, CacheInterceptor } from "@wavemaker/variables/src/interceptor";


const addedInterceptors = new Map<string, boolean>();

export const addServiceVariableInterceptor = ({
    url,
    method,
    match,
    intercept,
    cache
}: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
    match?: (context: ServiceVariableContext) => boolean;
    intercept?: (context: ServiceVariableContext) => Promise<any>;
    cache?: {
        type?: 'session' | 'persistent';
        timeout?: number;
        passThrough?: boolean;
    };
}) => {
    addedInterceptors.set(url, true);
    cache = Object.assign({}, {
        type: 'session',
        timeout: 5 * 60 * 1000,
        passThrough: false
    }, cache);
    let interceptor: Interceptor<any> = new ServiceVariableInterceptor({
        url,
        method,
        match,
        intercept
    });
    if (cache) {
        interceptor = new CacheInterceptor(interceptor as any, 
            cache.type,
            cache.timeout,
            cache.passThrough);
    }
    interceptorManager.add(interceptor);
    return interceptor;
};


export const addPassThroughInterceptor = ({
    url,
    cache
}: {
    url: string,
    cache: {
        timeout: number;
    }
}) => {
    if (addedInterceptors.get(url)) {
        return;
    }
    addedInterceptors.set(url, true);
    addServiceVariableInterceptor({
        url: url,
        cache: {
            timeout: cache.timeout,
            passThrough: true
        }
    });
};