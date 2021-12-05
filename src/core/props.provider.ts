import { BaseProps } from "./base.component";

export class PropsProvider<T extends BaseProps> {
    private oldProps: any = {};
    private overriddenProps: any = {};
    private propsProxy: T;
    private isDirty = false;

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
                this.isDirty = this.overriddenProps[propName] !== value;
                this.overriddenProps[propName] = value;
                if (this.oldProps[propName] !== value) {
                    const oldValue = this.oldProps[propName];
                    this.onChange(propName, value, oldValue);
                    this.oldProps[propName] = value;
                }
                return true;
            }
        }));
    }

    check(nextProps: T = this.initprops) {
      const result = Object.keys(nextProps).reduce((b, k) => {
            let flag = false;
            //@ts-ignore
            const value = nextProps[k];
            const oldValue = this.oldProps[k];
            if (!this.overriddenProps[k] && this.overriddenProps[k] !== '' && this.oldProps[k] !== value) {
                this.oldProps[k] = value;
                this.onChange(k, value, oldValue);
                flag = true;
            }
            return b || flag;
        }, false) || this.isDirty;

      this.isDirty = false;
      return result;
    }

    has(propName: string) {
        return Object.keys(this.initprops).find(k => k === propName);
    }

    get() {
        return this.propsProxy;
    }
}
