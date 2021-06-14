import { isEqual, merge } from 'lodash';
import React, { ReactNode } from 'react';
import { TextStyle } from 'react-native';
import { ROOT_LOGGER } from '@wavemaker/app-rn-runtime/core/logger'
import BASE_THEME, { DEFAULT_CLASS, DEFAULT_STYLE, NamedStyles, AllStyle, ThemeConsumer } from '../styles/theme';
import { PropsProvider } from './props.provider';

export const WIDGET_LOGGER = ROOT_LOGGER.extend('widget');

export class BaseComponentState<T extends BaseProps> {
    public props = {} as T;
}

export type BaseStyles = NamedStyles<any> & {
    root: AllStyle,
    text: TextStyle
}

export interface LifecycleListener {
    onComponentInit: (c: BaseComponent<any, any, any>) => void;
    onComponentDestroy: (c: BaseComponent<any, any, any>) => void;
}

export class BaseProps {
    id?: string = null as any;
    name?: string = null as any;
    key?: string = null as any;
    show? = true;
    styles?: any = null;
    listener?: LifecycleListener = null as any;
}

export abstract class BaseComponent<T extends BaseProps, S extends BaseComponentState<T>, L extends BaseStyles> extends React.Component<T, S> {
    public styles: L = {
        root: {},
        text: {}
    } as L;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T, S, L>;
    private initialized = false;
    public cleanup = [] as Function[];
    public theme = BASE_THEME;

    constructor(markupProps: T, public defaultClass = DEFAULT_CLASS, private defaultStyles?: L, defaultProps?: T, defaultState?: S) {
        super(markupProps);
        this.state = (defaultState || {} as S);
        this.propertyProvider = new PropsProvider<T>(
            Object.assign(defaultProps || {}, markupProps),
            (name: string, $new: any, $old: any) => {
                WIDGET_LOGGER.debug(() => `${this.props.name ?? this.constructor.name}: ${name} changed from ${$old} to ${$new}`);
                this.onPropertyChange(name, $new, $old);
                if (name === 'styles') {
                    this.styles = null as any;
                }
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
                    this.setState(() => ({
                        props: this.propertyProvider.get()
                    }))
                    return true;
                } else {
                    return Reflect.set(target, prop, value);
                }
            }
        }));
    }

    onPropertyChange(name: string, $new: any, $old: any) {

    }

    updateState(state: S) {
      if (state.props) {
        Object.keys(state.props).forEach((k) => {
          //@ts-ignore
          this.state.props[k] = state.props[k];
        });
        state.props = this.state.props
      }
        if (!this.initialized) {
            Object.keys(state).forEach((key) => {
                //@ts-ignore
                this.state[key] = state[key];
            });
        } else {
            this.setState(() => state);
        }
    }

    shouldComponentUpdate(nextProps: T, nextState: S, nextContext: any) {
        return this.propertyProvider.check(nextProps) || !isEqual(nextState, this.state);
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
        args = args && args.map(a => (a === this) ? this.proxy : a)
        if (callBack) {
            callBack.apply(this.proxy, args);
        }
        if (eventName === 'onTap') {
          this.invokeEventCallback && this.invokeEventCallback('onClick', args);
        }
    }

    protected abstract renderWidget(props: T): ReactNode;

    public render(): ReactNode {
        WIDGET_LOGGER.info(() => `${this.props.name ?? this.constructor.name} is rendering.`);
        const props = this.state.props;
        return props.show !== false ?
            (<ThemeConsumer>{(theme) => {
                this.theme = theme || BASE_THEME;
                this.styles = this.styles || merge({}, this.theme.getStyle(this.defaultClass) || this.defaultStyles, this.props.styles);
                return this.renderWidget(this.state.props);
            }}</ThemeConsumer>) : null;
    }
}
