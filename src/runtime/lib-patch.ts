
export const setTimeout = (onComplete: Function) => {
    return (cb: Function, millis: number) => {
        const patch = () => {
            cb && cb();
            onComplete && onComplete();
        };
        return global.setTimeout(patch, millis);
    };
};

export const setInterval = (onComplete: Function) => {
    return (cb: Function, millis: number, ...params: any[]) => {
        const patch = () => {
            cb && cb();
            onComplete && onComplete();
        };
        return global.setInterval(patch, millis);
    };
};

export const preparePatch = (onComplete: Function) => {
    return {
        'setTimeout': setTimeout(onComplete),
        'setInterval': setInterval(onComplete)
    };
};
