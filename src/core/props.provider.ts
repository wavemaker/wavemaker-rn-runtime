import { BaseProps } from "./base.component";

export class PropsProvider<T extends BaseProps> {
    private oldProps: any = {};
    private overriddenProps: any = {};
    private propsProxy: T;

    constructor(private initprops: T, private onChange = (name: string, $new: any, $old: any) => {}) {
        this.initprops = this.initprops || {};
        //@ts-ignore
        this.propsProxy = (new Proxy({}, {
            get: (target, prop, receiver): any => {
                const propName = prop.toString();
                let value = this.overriddenProps[propName];
                if (value === undefined) {
                    value = this.oldProps[propName];
                }
                return value;
            },
            set: (target: any, prop, value: any): any => {
                const propName = prop.toString();
                if (!this.has(propName)) {
                    return false;
                }
                this.overriddenProps[propName] = value;
                if (this.oldProps[propName] !== value) {
                    this.onChange(propName, value, this.oldProps[propName]);
                    this.oldProps[propName] = value;
                }
                return true;
            }
        }));
        this.check();
    }

    check(nextProps: T = this.initprops) {
        return Object.keys(nextProps).reduce((b, k) => {
            //@ts-ignore
            const value = nextProps[k];
            //TODO: comparison has to be improved
            if (!this.overriddenProps[k] && this.oldProps[k] !== value) {
                this.onChange(k, value, this.oldProps[k]);
                this.oldProps[k] = value;
                b = b || !(value instanceof Function);
            }
            return b;
        }, false);
    }    

    has(propName: string) {
        return Object.keys(this.initprops).find(k => k === propName);
    }

    get() {
        return this.propsProxy;
    }
}