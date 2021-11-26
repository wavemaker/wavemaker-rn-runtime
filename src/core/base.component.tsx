import { isEqual } from 'lodash';
import React, { ReactNode } from 'react';
import { TextStyle } from 'react-native';
import { ROOT_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import BASE_THEME, { DEFAULT_CLASS, NamedStyles, AllStyle, ThemeConsumer, attachBackground } from '../styles/theme';
import { PropsProvider } from './props.provider';
import { assignIn } from 'lodash-es';

export const WIDGET_LOGGER = ROOT_LOGGER.extend('widget');

export const ParentContext = React.createContext(null as any);

export class BaseComponentState<T extends BaseProps> {
    public props = {} as T;
}

export type BaseStyles = NamedStyles<any> & {
    root: AllStyle,
    text: TextStyle
}

export interface LifecycleListener {
    onComponentChange?: (c: BaseComponent<any, any, any>) => void;
    onComponentInit?: (c: BaseComponent<any, any, any>) => void;
    onComponentDestroy?: (c: BaseComponent<any, any, any>) => void;
}

export class BaseProps {
    id?: string = null as any;
    name?: string = null as any;
    key?: any = null as any;
    show? = true as Boolean | String | Number;
    styles?: any = null;
    listener?: LifecycleListener = null as any;
}

export abstract class BaseComponent<T extends BaseProps, S extends BaseComponentState<T>, L extends BaseStyles> extends React.Component<T, S> {
    public styles: L = null as any;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T, S, L>;
    public initialized = false;
    public cleanup = [] as Function[];
    public theme = BASE_THEME;
    public updateStateTimeouts= [] as NodeJS.Timeout[];
    public parent: BaseComponent<any, any, any> = null as any;

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
                    return true;
                } else {
                    return Reflect.set(target, prop, value);
                }
            }
        }));
        this.cleanup.push(() => {
            this.updateStateTimeouts.forEach(v => clearTimeout(v));
        })
    }

    onPropertyChange(name: string, $new: any, $old: any) {

    }

    updateState(newPartialState: S, callback?: ()=>void) {
        const propsUpdated = !!newPartialState.props;
        const stateFn = (oldState: S) => {
            const newState = assignIn({} as S, oldState, newPartialState);
            if (newPartialState.props) {
                Object.keys(newPartialState.props).forEach((k) => {
                    //@ts-ignore
                    oldState.props[k] = newState.props[k];
                });
                newState.props = oldState.props;
            }
            return newState;
        };
        const onUpdateState = () => {
            callback && callback();
            propsUpdated 
                && this.props.listener?.onComponentChange
                && this.props.listener?.onComponentChange(this);
        }
        if (!this.initialized) {
            this.state = stateFn(this.state);
            onUpdateState();
        } else {
            const timeoutId = setTimeout(() => {
                this.setState(stateFn, onUpdateState);
                this.updateStateTimeouts.splice(this.updateStateTimeouts.indexOf(timeoutId), 1);
            });
            this.updateStateTimeouts.push(timeoutId);
        }
    }

    shouldComponentUpdate(nextProps: T, nextState: S, nextContext: any) {
        return this.propertyProvider.check(nextProps) || !isEqual(nextState, this.state);
    }

    componentDidMount() {
        if (this.props.listener && this.props.listener.onComponentInit) {
            this.props.listener.onComponentInit(this.proxy);
        }
        this.initialized = true;
    }

    componentWillUnmount() {
        if (this.props.listener && this.props.listener.onComponentDestroy) {
            this.props.listener.onComponentDestroy(this.proxy);
        }
        this.cleanup.forEach(f => f && f());
    }

    invokeEventCallback(eventName: string, args: any[]) {
        //@ts-ignore
        const callBack: Function = this.props[eventName];
        args = args && args.map(a => (a === this) ? this.proxy : a)
        if (callBack) {
            try {
                callBack.apply(this.proxy, args);
            } catch(e) {
                console.error(e);
            }
        }
    }

    protected abstract renderWidget(props: T): ReactNode;

    
    public render(): ReactNode {
        WIDGET_LOGGER.info(() => `${this.props.name ?? this.constructor.name} is rendering.`);
        const props = this.state.props;
        return props.show !== false && props.show !== 'false' && props.show !== '0'?
            (<ParentContext.Consumer>
                {(parent) => {
                    this.parent = parent;
                    return (
                        <ParentContext.Provider value={this}>
                        <ThemeConsumer>
                            {(theme) => {
                                this.theme = theme || BASE_THEME;
                                this.styles =  this.styles || deepCopy({}, this.theme.getStyle(this.defaultClass) || 
                                            this.defaultStyles, this.props.styles);  
                                return attachBackground(this.renderWidget(this.state.props), this.styles.root);
                            }}
                        </ThemeConsumer>
                    </ParentContext.Provider>);
                }}
            </ParentContext.Consumer>) : null;
    }
}
