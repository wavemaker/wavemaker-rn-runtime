import { ActionConfig, BaseAction } from "./base-action";
export interface TimerActionConfig extends ActionConfig {
    repeating: Boolean;
    delay: number;
    onSuccess: any;
}
export class TimerAction extends BaseAction<TimerActionConfig> {
    repeating: Boolean;
    nonRepeating = false;
    _isFired = false;
    _schedulerID: any = -1;
    delay: number;
    constructor(config: TimerActionConfig) {
        super(config);
        this.repeating = config.repeating;
        this.delay = config.delay || 500;
    }

    invoke(options: any, success: any, error: any) {
        return this.fire(options, success, error) as any;
    }

    cancel() {
        if (this._schedulerID > -1) {
            if (this.repeating) {
                clearInterval(this._schedulerID);
            } else {
                clearTimeout(this._schedulerID);
            }
            this._schedulerID = -1;
        }
    }

    destroy() {
        this.cancel();
    }

    pause() {
        this.cancel();
    }

    trigger(options: any, success: any, error: any) {
        if (this._schedulerID > -1) {
            return;
        }
        const repeatTimer = this.repeating,
            delay = this.delay,
            exec = () => {
                this.config.onSuccess && this.config.onSuccess();
            };

        this._schedulerID = repeatTimer ? setInterval(exec, delay) : setTimeout( () => {
            exec();
            this._schedulerID = -1;
        }, delay);

        return this._schedulerID;
    }

    fire(options: any, success: any, error: any) {
        if(this.repeating) {
            this._isFired = true;
        }
        return this.trigger(options, success, error);
    }
}