import { assign, isEqual, isUndefined } from 'lodash';
import React, { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { AnimatableProperties } from 'react-native-animatable';
import * as Animatable from 'react-native-animatable';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { StyleProps, getStyleName } from '@wavemaker/app-rn-runtime/styles/style-props';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import { ROOT_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import BASE_THEME, { NamedStyles, AllStyle, ThemeConsumer, ThemeEvent } from '../styles/theme';
import EventNotifier from './event-notifier';
import { PropsProvider } from './props.provider';
import { assignIn } from 'lodash-es';
import { HideMode } from './if.component';
import { AssetConsumer } from './asset.provider';
import { FixedView } from './fixed-view.component';

export const WIDGET_LOGGER = ROOT_LOGGER.extend('widget');

export const ParentContext = React.createContext(null as any);

export class BaseComponentState<T extends BaseProps> {
    public animationId?: number = 0;
    public animatableProps?: AnimatableProperties<ViewStyle> = undefined;
    public props = {} as T;
    public hide? = false;
}

export type BaseStyles = NamedStyles<any> & {
    root: AllStyle,
    text: TextStyle
}

export function defineStyles<T>(styles: T): T {
    return deepCopy({
        text: {
            fontFamily: ThemeVariables.INSTANCE.baseFont
        }
    }, styles);
}

export interface LifecycleListener {
    onComponentChange?: (c: BaseComponent<any, any, any>) => void;
    onComponentInit?: (c: BaseComponent<any, any, any>) => void;
    onComponentDestroy?: (c: BaseComponent<any, any, any>) => void;
}

export class BaseProps extends StyleProps {
    id?: string = null as any;
    name?: string = null as any;
    key?: any = null as any;
    disabled? = false;
    show? = true as Boolean | String | Number;
    styles?: any = null;
    classname?: string = null as any;
    listener?: LifecycleListener = null as any;
    showindevice?: ('xs'|'sm'|'md'|'lg'|'xl'|'xxl')[] = null as any;
    showskeleton?: boolean = false;
}

export abstract class BaseComponent<T extends BaseProps, S extends BaseComponentState<T>, L extends BaseStyles> extends React.Component<T, S> {
    public styles: L = null as any;
    public hideMode = HideMode.ADD_TO_DOM;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T, S, L>;
    public initialized = false;
    public cleanup = [] as Function[];
    public theme = BASE_THEME;
    public updateStateTimeouts= [] as NodeJS.Timeout[];
    public parent: BaseComponent<any, any, any> = null as any;
    public destroyed = false;
    public _showSkeleton = false;
    public isFixed = false;
    private notifier = new EventNotifier();
    private parentListenerDestroyers = [] as Function[];
    public _background = <></>;
    private styleOverrides = {} as any;
    public loadAsset: (path: string) => number | string = null as any;

    constructor(markupProps: T, public defaultClass: string, defaultProps?: T, defaultState?: S) {
        super(markupProps);
        this.state = (defaultState || {} as S);
        this.propertyProvider = new PropsProvider<T>(
            assign({}, defaultProps),
            assign({}, markupProps),
            (name: string, $new: any, $old: any) => {
                WIDGET_LOGGER.debug(() => `${this.props.name ?? this.constructor.name}: ${name} changed from ${$old} to ${$new}`);
                if (this.initialized) {
                    const styleName = getStyleName(name);
                    if (styleName) {
                        if ($new === undefined) {
                            delete this.styleOverrides[styleName];
                        } else {
                            this.styleOverrides[styleName] = $new;
                        }
                    }
                }
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
                    const props = {} as any;
                    props[propName] = value;
                    this.updateState({
                        props: props
                    } as S);
                    return true;
                } else {
                    return Reflect.set(target, prop, value);
                }
            }
        }));
        this.cleanup.push(() => {
            this.updateStateTimeouts.forEach(v => clearTimeout(v));
        });
        this.cleanup.push(this.theme.subscribe(ThemeEvent.CHANGE, () => {
            this.forceUpdate();
        }));
        this.cleanup.push(() => {
            this.destroyParentListeners();
        });
    }

    public subscribe(event: string, fn: Function) {
        return this.notifier.subscribe(event, fn);
    }

    public animate(props: AnimatableProperties<ViewStyle>) {
        this.setState({
            animationId: Date.now(),
            animatableProps: props
        });
    }

    setProp(propName: string, value: any) {
        this.propertyProvider.set(propName, value);
        this.updateState({props:{}} as S);
    }

    setPropDefault(propName: string, value: any) {
        this.propertyProvider.setDefault(propName, value);
    }

    onPropertyChange(name: string, $new: any, $old: any) {
        switch(name) {
            case 'showskeleton': {
                if (this.initialized) {
                    this.cleanRefresh();
                }
            }
        }
    }

    getDefaultStyles() {
        return this.theme.getStyle(this.defaultClass);
    }

    reset() {

    }

    updateState(newPartialState: S, callback?: ()=>void) {
        if (this.destroyed) {
            return;
        }
        const stateFn = (oldState: S) => {
            const oldProps = oldState.props;
            const newState = this.initialized ? assignIn({}, oldState, newPartialState) : assignIn(oldState, newPartialState);
            if (newPartialState.props) {
                Object.keys(newPartialState.props).forEach((k) => {
                    //@ts-ignore
                    oldProps[k] = newState.props[k];
                });
                newState.props = oldProps;
            }
            return newState;
        };
        const onUpdateState = () => {
            callback && callback();
            this.props.listener?.onComponentChange
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
        if (this.propertyProvider.check(nextProps)) {
            return true;
        }
        for(let key in nextState) {
            if(key !== 'props' && (!(key in this.state) || nextState[key] !== this.state[key])) {
                return true;
            }
        }

        for(let key in this.state) {
            if(key !== 'props' && (!(key in nextState) || this.state[key] !== nextState[key])) {
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        if (this.props.listener && this.props.listener.onComponentInit) {
            this.props.listener.onComponentInit(this.proxy);
        }
        this.initialized = true;
    }

    componentWillAttach() {
        if (this.isFixed) {
            this.setState({hide: false});
        }
    }

    componentWillDetach() {
        if (this.isFixed) {
            this.setState({hide: true});
        }
    }

    componentWillUnmount() {
        this.destroyed = true;
        if (this.props.listener && this.props.listener.onComponentDestroy) {
            this.props.listener.onComponentDestroy(this.proxy);
        }
        this.cleanup.forEach(f => f && f());
        this.notifier.notify('destroy', []);
    }

    invokeEventCallback(eventName: string, args: any[]) {
        //@ts-ignore
        const callBack: Function = this.props[eventName];
        args = args && args.map(a => (a === this) ? this.proxy : a)
        if (callBack) {
            try {
              return callBack.apply(this.proxy, args);
            } catch(e) {
                console.error(e);
            }
        }
    }

    isVisible() {
        const show = this.state.props.show;
        return show !== false && show !== 'false' && show !== '0' && show !== null;
    }

    protected abstract renderWidget(props: T): ReactNode;

    public refresh() {
        this.forceUpdate();
    }

    public cleanRefresh() {
        this.forceUpdate(() => this.notifier.notify('forceUpdate', []));
    }
    
    public renderSkeleton (props: T): ReactNode {
        return null;
    }

    public destroyParentListeners() {
        this.parentListenerDestroyers.map(fn => fn());
    }

    private setParent(parent: BaseComponent<any, any, any>) {
        if (parent && this.parent !== parent)  {
            this.parent = parent;
            this.parentListenerDestroyers = [
                this.parent.subscribe('forceUpdate', () => {
                    this.cleanRefresh();
                }),
                this.parent.subscribe('destroy', () => {
                    this.destroyParentListeners();
                })
            ];
        }
    }

    copyStyles(property: string, from: any, to: any) {
        if (!isUndefined(from[property])) {
        to[property] = from[property];
        }
    }

    renderFixedContainer(props: T) {
        const style = {} as ViewStyle;
        const rootStyle = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            height: "100%"
        } as ViewStyle;
        this.copyStyles('left', this.styles.root, style);
        this.copyStyles('top', this.styles.root, style);
        this.copyStyles('right', this.styles.root, style);
        this.copyStyles('bottom', this.styles.root, style);
        this.copyStyles('width', this.styles.root, style);
        this.copyStyles('height', this.styles.root, style);
        this.styles = this.theme.mergeStyle(this.styles, {root: rootStyle});
        return (<FixedView style={style} theme={this.theme}>{this.addAnimation(this.renderWidget(props))}</FixedView>);
    }

    private addAnimation(n: ReactNode) {
        if (!this.state.animatableProps) {
            return n;
        }
        return (<Animatable.View key={this.state.animationId} {...this.state.animatableProps}>{n}</Animatable.View>);
    }
    
    private setBackground() {
        const bgStyle = this.styles.root as any;
        this._background = (
            <BackgroundComponent 
                image={bgStyle.backgroundImage}
                position={bgStyle.backgroundPosition}
                size={bgStyle.backgroundSize}
                repeat={bgStyle.backgroundRepeat}
                resizeMode={bgStyle.backgroundResizeMode}
                style={{borderRadius: this.styles.root.borderRadius}}>
            </BackgroundComponent>
        );
        delete (this.styles.root as any)['backgroundImage'];
        delete (this.styles.root as any)['backgroundPosition'];
        delete (this.styles.root as any)['backgroundResizeMode'];
        delete (this.styles.root as any)['backgroundSize'];
        delete (this.styles.root as any)['backgroundRepeat'];
    }
      
    public render(): ReactNode {
        WIDGET_LOGGER.info(() => `${this.props.name ?? this.constructor.name} is rendering.`);
        const props = this.state.props;
        if (this.state.hide || (!this.isVisible() && this.hideMode === HideMode.DONOT_ADD_TO_DOM)) {
            return null;
        }
        this.isFixed = false;
        return (<AssetConsumer>
            {(loadAsset) => {
            this.loadAsset = loadAsset;
            return (<ParentContext.Consumer>
                {(parent) => {
                    this.setParent(parent);
                    this._showSkeleton = this.parent?._showSkeleton || !!this.state.props.showskeleton;
                    return (
                        <ParentContext.Provider value={this}>
                        <ThemeConsumer>
                            {(theme) => {
                                this.theme = theme || BASE_THEME;
                                this.styles =  this.theme.mergeStyle(
                                    this.getDefaultStyles(),
                                    props.disabled ? this.theme.getStyle(this.defaultClass + '-disabled') : null,
                                    props.classname && this.theme.getStyle(props.classname),
                                    props.showindevice && this.theme.getStyle('d-all-none ' + props.showindevice.map(d => `d-${d}-flex`).join(' ')),
                                    this.props.styles,
                                    {
                                        root: this.styleOverrides,
                                        text: this.styleOverrides
                                    });
                                if (this.styles.root.hasOwnProperty('_background')) {
                                  delete this.styles.root.backgroundColor;
                                }
                                if (!this.isVisible()) {
                                    assign(this.styles, this.theme.getStyle('hidden'))
                                }
                                let eleToRender = (this._showSkeleton && this.renderSkeleton(props));
                                if (eleToRender) {
                                    return eleToRender;
                                }
                                this.setBackground();
                                this.isFixed = (this.styles.root.position as any) === 'fixed';
                                if (this.isFixed) {
                                    this.styles.root.position  = undefined;
                                    return this.renderFixedContainer(props);
                                }
                                return this.addAnimation(this.renderWidget(this.state.props));
                            }}
                        </ThemeConsumer>
                    </ParentContext.Provider>);
                }}
            </ParentContext.Consumer>);
        }}
        </AssetConsumer>);
    }
}
