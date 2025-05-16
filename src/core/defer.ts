export class Defer<T> {
    public static resolve = <T>(t:T) => {
        const defer = new Defer();
        defer.resolve(t);
        return defer;
    };
    public static reject = <T>(reason: any) => {
        const defer = new Defer<T>();
        defer.reject(reason);
        return defer;
    };
    public promise: Promise<T>;
    public _isDone = false;
    public _isResolved = false;
    public _isRejected = false;
    public _isAborted = false;
    public _isTimedout = false;
    private _resolve: (t: T | PromiseLike<T>) => void = null as any;
    private _reject: (reason: any) => void = null as any;
    public readonly maxWaitTime?: number; 

    public readonly onAbort?: () => any;
    public readonly onTimeout?: () => any;

    constructor(options?: {
        onResolve?: (t: T | PromiseLike<T>) => void,
        onReject?: (reason: any) => void,
        onTimeout?: () => any,
        onAbort?: () => any,
        maxWaitTime?: number
    }) {
        this.onAbort = options?.onAbort;
        this.onTimeout = options?.onTimeout;
        this.maxWaitTime = options?.maxWaitTime;
        let cancelTimeout = () => {};
        if (this.maxWaitTime && this.maxWaitTime > 0) {
            const timerId = setTimeout(() => {
                this._isTimedout = true;
                this.reject(this.state);
            }, this.maxWaitTime);
            cancelTimeout = () => {
                clearTimeout(timerId);
                cancelTimeout = () => {};
            };
        }
        this.promise = new Promise((resolve, reject) => {
            new Promise<T>((resolve, reject) => {
                this._resolve = (t: T | PromiseLike<T>) => {
                    if (!this.isDone) {
                        this._isResolved = true;
                        this._isDone = true;
                        cancelTimeout();
                        options?.onResolve?.(t);
                        return resolve(t);
                    }
                    throw new Error(`Promise is already ${this._isResolved ? 'resolved' : 'rejected'}`);
                };
                this._reject = (reason: any) => {
                    if (!this.isDone) {
                        this._isRejected = true;
                        this._isDone = true;
                        cancelTimeout();
                        options?.onReject?.(reason);
                        return reject(reason);
                    }
                    throw new Error(`Promise is already ${this._isResolved ? 'resolved' : 'rejected'}`);
                };
            }).then(resolve, reject);
        });
    }

    public get resolve() {
        return this._resolve;
    }

    public get reject() {
        return this._reject;
    }

    public abort() {
        this.onAbort && this.onAbort();
        this._isAborted = true;
        this.reject(this.state);
    }

    public get isResolved() {
        return this._isResolved;
    }

    public get isRejected() {
        return this._isRejected;
    }

    public get isDone() {
        return this._isDone;
    }
    
    public waitFor(defer: Defer<any>) {
        defer.promise.then(this.resolve.bind(this), defer.reject.bind(this));
        this.abort = defer.abort;
    }

    public get state(): 'PENDING' | 'RESOLVED' | 'REJECTED' | 'ABORTED' | 'TIMEDOUT' {
        if (this._isResolved) {
            return 'RESOLVED';
        }
        if (this._isTimedout) {
            return 'TIMEDOUT';
        }
        if (this._isAborted) {
            return 'ABORTED';
        }
        if (this._isRejected) {
            return 'REJECTED';
        }
        return 'PENDING';
    }

    public get isAborted() {
        return this._isAborted;
    }
}