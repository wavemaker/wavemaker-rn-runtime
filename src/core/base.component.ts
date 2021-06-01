import { merge } from 'lodash';
import React, { ReactNode } from 'react';
import BASE_THEME, { DEFAULT_CLASS, DEFAULT_STYLE } from '../styles/theme';
import { PropsProvider } from './props.provider';

export class BaseComponentState<T extends BaseProps> {
    public props = {} as T;
}

export interface LifecycleListener {
    onComponentInit: (c: BaseComponent<any, any>) => void;
    onComponentDestroy: (c: BaseComponent<any, any>) => void;
}

export class BaseProps {
    name?: string = null as any;
    themeToUse? = BASE_THEME;
    show? = true;
    styles?: any = null;
    listener?: LifecycleListener = null as any;
}

export abstract class BaseComponent<T extends BaseProps, S extends BaseComponentState<T>> extends React.Component<T, S> {
    public styles: any = DEFAULT_STYLE;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T, S>;
    private initialized = false;
    public cleanup = [] as Function[];

    constructor(markupProps: T, public defaultClass = DEFAULT_CLASS, private defaultStyles = DEFAULT_STYLE, defaultProps?: T, defaultState?: S) {
        super(markupProps);
        this.state = (defaultState || {} as S);
        this.propertyProvider = new PropsProvider<T>(
            Object.assign(defaultProps || {}, markupProps), 
            (name: string, $new: any, $old: any) => {
                this.onPropertyChange(name, $new, $old);
            });
        //@ts-ignore
        this.state.props =this.propertyProvider.get();
        this.propertyProvider.check();
        //@ts-ignore
        this.proxy = (new Proxy(this, {
            get: (target, prop, receiver): any => {
                const propName = prop.toString();
                if (this.propertyProvider.has(propName)) {
                    //@ts-ignore
                    return this.state.props[propName];
                }
                return Reflect.get(target, prop, receiver);
            },
            set: (target: any, prop, value: any): any => {
                const propName = prop.toString();
                if (this.propertyProvider.has(propName)) {
                    // @ts-ignore
                    this.state.props[propName] = value;
                    this.setState({
                        props: this.propertyProvider.get()
                    } as S)
                    return true;
                } else {
                    return Reflect.set(target, prop, value);
                }
            }
        }));
    }

    onPropertyChange(name: string, $new: any, $old: any) {

    }

    updateState(key: string, value: any) {
        if (!this.initialized) {
            //@ts-ignore
            this.state[key] = value;
        } else {
            const state = {};
            //@ts-ignore
            state[key] = value;
            this.setState(state);
        }
    }

    shouldComponentUpdate(nextProps: T, nextState: S, nextContext: any) {
        if (this.propertyProvider.check(nextProps)) {
            this.setState({
                props: this.propertyProvider.get()
            } as S);
            return true;
        }
        return !!(super.shouldComponentUpdate && super.shouldComponentUpdate(nextProps, nextState, nextContext));
    }

    componentDidMount() {
        if (this.props.listener) {
            this.props.listener.onComponentInit(this.proxy);
        }
        this.initialized = true;
    }

    componentWillUnmount() {
        if (this.props.listener) {
            this.props.listener.onComponentDestroy(this.proxy);
        }
        this.cleanup.forEach(f => f && f());
    }

    invokeEventCallback(eventName: string, args: any[]) {
        //@ts-ignore
        const callBack: Function = this.props[eventName];
        if (callBack) {
            callBack.apply(this.proxy, args);
        }
        args && args.map(a => (a === this) ? this.proxy : a)
        if (eventName === 'onTap') {
            this.invokeEventCallback('onClick', args);
        }
    }

    public render(): ReactNode {
        this.styles = merge({}, this.props.themeToUse?.getStyle(this.defaultClass) || this.defaultStyles, this.props.styles);
        return null;
    }
}