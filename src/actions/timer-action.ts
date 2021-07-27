import { ActionConfig, BaseAction } from "./base-action";
export interface TimerActionConfig extends ActionConfig {
    repeating: Boolean;
    delay: any;
    onSuccess: any;
}
export class TimerAction extends BaseAction {
    repeating: Boolean;
    _isFired = false;
    _promise: any = null;
    delay: any;
    constructor(config: TimerActionConfig) {
        super(config);
        this.repeating = config.repeating;
        this.delay = config.delay || 500;
    }

    invoke(options: any, success: any, error: any) {
        return this.fire(options, success, error);
    }

    cancel() {
        if (this._promise) {
            if (this.repeating) {
                clearInterval(this._promise);
            } else {
                clearTimeout(this._promise);
            }
            this._promise = undefined;
        }
    }

    trigger(options: any, success: any, error: any) {
        if (this._promise) {
            return;
        }
        const repeatTimer = this.repeating,
            delay = this.delay,
            exec = () => {
                this.config.onSuccess && this.config.onSuccess();
            };

        this._promise = repeatTimer ? setInterval(exec, delay) : setTimeout( () => {
            exec();
            this._promise = undefined;
        }, delay);

        return this._promise;
    }

    fire(options: any, success: any, error: any) {
        if(this.repeating) {
            this._isFired = true;
        }
        return this.trigger(options, success, error);
    }
}