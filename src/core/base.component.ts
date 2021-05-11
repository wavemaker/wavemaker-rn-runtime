import { merge } from 'lodash';
import React, { ReactNode } from 'react';
import BASE_THEME, { DEFAULT_CLASS, DEFAULT_STYLE } from '../styles/theme';
import { PropsProvider } from './props.provider';

export interface ComponentState<T extends BaseProps> {
    props: T;
}

export class BaseProps {
    name: string = null as any;
    themeToUse = BASE_THEME;
    show = true;
    styles: any = null;
    onInit: Function = null as any;
    onDestroy: Function = null as  any;
}

export abstract class BaseComponent<T extends BaseProps> extends React.Component<T, ComponentState<T>> {
    public styles: any = DEFAULT_STYLE;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T>;

    constructor(markupProps: T, public defaultClass = DEFAULT_CLASS, private defaultStyles = DEFAULT_STYLE, defaultProps?: T) {
        super(markupProps);
        this.propertyProvider = new PropsProvider<T>(
            Object.assign(defaultProps || {}, markupProps), 
            (name: string, $new: any, $old: any) => {
                this.onPropertyChange(name, $new, $old);
            });
        this.state = {
            props: this.propertyProvider.get()
        };
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
                    })
                    return true;
                } else {
                    return Reflect.set(target, prop, value);
                }
            }
        }));
    }

    onPropertyChange(name: string, $new: any, $old: any) {

    }

    shouldComponentUpdate(nextProps: T, nextState: ComponentState<T>, nextContext: any) {
        if (this.propertyProvider.check(nextProps)) {
            this.setState({
                props: this.propertyProvider.get()
            });
            return true;
        }
        return !!(super.shouldComponentUpdate && super.shouldComponentUpdate(nextProps, nextState, nextContext));
    }

    componentDidMount() {
        this.props.onInit && this.props.onInit(this.proxy);
    }

    componentWillUnmount() {
        this.props.onDestroy && this.props.onDestroy(this);
    }

    invokeEventCallback(eventName: string, args: any[]) {
        //@ts-ignore
        const callBack: Function = this.props[eventName];
        if (callBack) {
            callBack.apply(this.proxy, args);
        }
        if (eventName === 'onTap') {
            this.invokeEventCallback('onClick', args);
        }
    }

    public render(): ReactNode {
        this.styles = merge({}, this.props.themeToUse.getStyle(this.defaultClass) || this.defaultStyles, this.props.styles);
        return null;
    }
}