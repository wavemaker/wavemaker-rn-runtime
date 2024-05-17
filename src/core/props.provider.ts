import { assign, isNil } from "lodash-es";
import { BaseProps } from "./base.component";

export class PropsProvider<T extends BaseProps> {
    private oldProps: any = {};
    private overriddenProps: any = {};
    private propsProxy: T;
    private isDirty = false;
    private propertyNames = {} as any;

    constructor(private defaultProps: T, private initprops: T, private onChange = (name: string, $new: any, $old: any) => {}) {
        this.initprops = this.initprops || {};
        Object.keys(defaultProps).forEach(k => this.propertyNames[k] = true);
        Object.keys(initprops).forEach(k => this.propertyNames[k] = true);
        //@ts-ignore
        this.propsProxy = (new Proxy({}, {
            get: (target, prop, receiver): any => {
                const propName = prop.toString();
                let value = (this.defaultProps as any)[propName];
                if (this.overriddenProps.hasOwnProperty(propName)) {
                    value = this.overriddenProps[propName];
                } else if (this.oldProps.hasOwnProperty(propName)) {
                    value = this.oldProps[propName];
                }
                return value;
            },
            set: (target: any, prop, value: any): any => {
                const propName = prop.toString();
                if (!this.has(propName)) {
                    return true;
                }
                this.isDirty = this.isDirty || this.overriddenProps[propName] !== value;
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

    setDefault(propName: string, value: any) {
        (this.defaultProps as any)[propName] = value;
    }

    check(nextProps?: T) {
        if (!nextProps) {
            nextProps = assign({}, this.defaultProps, this.initprops);
        }
        const result = Object.keys(nextProps).reduce((b, k) => {
            let flag = false;
            //@ts-ignore
            const value = nextProps[k];
            const oldValue = this.oldProps[k];
            if (isNil(this.overriddenProps[k])
                && (!this.oldProps.hasOwnProperty(k)
                    || this.oldProps[k] !== value)) {
                this.oldProps[k] = value;
                this.onChange(k, value, oldValue);
                flag = true;
            }
            return b || flag;
        }, false) || this.isDirty;

      this.isDirty = false;
      return result;
    }

    // sets the property. But, value gets overriden when the original prop changes.
    set(name: string, value: any) {
        this.oldProps[name] = value;
        const oldValue = this.oldProps[name];
        if(oldValue !== value) {
            this.oldProps[name] = value;
            this.onChange(name, value, oldValue);
        }
    }

    has(propName: string) {
        return !!this.propertyNames[propName];
    }

    get() {
        return this.propsProxy;
    }
}
