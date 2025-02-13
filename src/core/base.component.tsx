import { assign, isUndefined, isNil } from 'lodash';
import React, { ReactNode } from 'react';
import { AccessibilityInfo, LayoutChangeEvent, Platform, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { AnimatableProps } from 'react-native-animatable';
import * as Animatable from 'react-native-animatable';
import ThemeVariables from '@wavemaker/app-rn-runtime/styles/theme.variables';
import { StyleProps, getStyleName } from '@wavemaker/app-rn-runtime/styles/style-props';
import { BackgroundComponent } from '@wavemaker/app-rn-runtime/styles/background.component';
import injector from '@wavemaker/app-rn-runtime/core/injector';
import { ROOT_LOGGER } from '@wavemaker/app-rn-runtime/core/logger';
import { deepCopy, getPosition, setPosition } from '@wavemaker/app-rn-runtime/core/utils';
import BASE_THEME, { NamedStyles, AllStyle, ThemeConsumer, ThemeEvent, Theme } from '../styles/theme';
import EventNotifier from './event-notifier';
import { PropsProvider } from './props.provider';
import { assignIn } from 'lodash-es';
import { HideMode } from './if.component';
import { AssetConsumer } from './asset.provider';
import { FixedView } from './fixed-view.component';
import { TextIdPrefixConsumer } from './testid.provider';
import { isScreenReaderEnabled } from './accessibility';
import { Tappable, TappableContext } from './tappable.component';
import { WmComponentNode } from './wm-component-tree';

export const WIDGET_LOGGER = ROOT_LOGGER.extend('widget');

export const ParentContext = React.createContext(null as any);

export class BaseComponentState<T extends BaseProps> {
    public animationId?: number = 0;
    public animatableProps?: AnimatableProps<ViewStyle> = undefined;
    public props = {} as T;
    public hide? = false;
    public highlight? = false;
}

export type BaseStyles = NamedStyles<any> & {
    root: AllStyle,
    text: TextStyle & {userSelect?: 'none'| 'text'}
}

export function defineStyles<T>(styles: T): T {
    return deepCopy({
        text: {
            fontFamily: ThemeVariables.INSTANCE.baseFont,
            userSelect: 'text'
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
    showskeleton?: boolean = undefined;
    deferload?: boolean = false;
    showskeletonchildren?: boolean = true;
    disabletoucheffect?:boolean = false;
}

export abstract class BaseComponent<T extends BaseProps, S extends BaseComponentState<T>, L extends BaseStyles> extends React.Component<T, S> {
    public styles: L = null as any;
    public hideMode = HideMode.ADD_TO_DOM;
    private propertyProvider: PropsProvider<T>;
    public proxy: BaseComponent<T, S, L>;
    public _INSTANCE: BaseComponent<T, S, L>;
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
    private i18nService = injector.I18nService.get();
    public testIdPrefix = '';
    private _showView = true;
    public closestTappable?: Tappable;   
    public componentNode: WmComponentNode;


    constructor(markupProps: T, public defaultClass: string, defaultProps?: T, defaultState?: S) {
        super(markupProps);
        this.state = (defaultState || {} as S);
        this.notifier.name = this.props.name || '';
        this.componentNode = new WmComponentNode({
            instance: this
        });
        this.propertyProvider = new PropsProvider<T>(
            assign({show: true}, defaultProps),
            assign({}, markupProps),
            (name: string, $new: any, $old: any) => {
                WIDGET_LOGGER.debug(() => `${this.props.name || this.constructor.name}: ${name} changed from ${$old} to ${$new}`);
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
                if (name === 'showskeleton' && this.initialized) {
                    setTimeout(() => this.cleanRefresh(), 100);
                }
                this.onPropertyChange(name, $new, $old);
            });
        //@ts-ignore
        this.state.props =this.propertyProvider.get();
        this._INSTANCE = this;
        //@ts-ignore
        this._showView = !this.props.deferload;
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
                    this.propertyProvider.overrideProp(propName, value);
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
        this.cleanup.push(AccessibilityInfo.addEventListener('screenReaderChanged',
            () => {
              setTimeout(() => {
                this.forceUpdate();
              }, 100);
            },
        ).remove);
        this.cleanup.push(() => {
            this.destroyParentListeners();
        });
    }

    public subscribe(event: string, fn: Function) {
        return this.notifier.subscribe(event, fn);
    }

    public notify(event: string, args: any[], emitToParent = false) {
        return this.notifier.notify(event, args, emitToParent);
    }

    public get isRTL(){
        return this.i18nService.isRTLLocale();
    }

    public animate(props: AnimatableProps<ViewStyle>) {
        this.setState({
            animationId: Date.now(),
            animatableProps: props
        });
    }

    setProp(propName: string, value: any) {
        this.propertyProvider.set(propName, value);
        this.updateState({props: {}} as S);
    }

    setPropDefault(propName: string, value: any) {
        this.propertyProvider.setDefault(propName, value);
    }
    
    onPropertyChange(name: string, $new: any, $old: any) {        
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
        this.parent?.componentNode?.remove(this.componentNode);
        this.notifier.destroy();
        this.notifier.notify('destroy', []);
    }
    
    componentDidUpdate(prevProps: Readonly<T>, prevState: Readonly<S>, snapshot?: any): void {
        if (this.propertyProvider.check(this.props)) {
            this.forceUpdate();
        }
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

    showView() {
        return this.isVisible();
    }

    isVisible() {
        const show = this.state.props.show;
        return show !== false && show !== 'false' && show !== '0' && !isNil(show) && show !== "";
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

    protected setParent(parent: BaseComponent<any, any, any>) {
        if (parent && this.parent !== parent)  {
            this.parent = parent;
            this.parent.componentNode.add(this.componentNode);
            this.notifier.setParent(parent.notifier);
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

    protected getName() {
        return this.props.name;
    }

    public handleLayout(event: LayoutChangeEvent ) {
        const key = this.getName();
        console.log("position:", event.nativeEvent.layout.y, event.nativeEvent.layout.x, key);
        if(key){
            const newLayoutPosition = {
                [key as string]: {
                    y: event.nativeEvent.layout.y,
                    x: event.nativeEvent.layout.x
                }
            }
            setPosition(newLayoutPosition);
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
            return (
                <>
                    {n}
                </>
            )
        }
        return (
            <Animatable.View 
                key={this.state.animationId} 
                {...this.state.animatableProps}
            >
                {n}
            </Animatable.View>);
    }
    
    private setBackground() {
        const bgStyle = this.styles.root as any;
        this._background = (
            <>
            <BackgroundComponent 
                image={bgStyle.backgroundImage}
                position={bgStyle.backgroundPosition}
                size={bgStyle.backgroundSize}
                repeat={bgStyle.backgroundRepeat}
                resizeMode={bgStyle.backgroundResizeMode}
                style={{borderRadius: this.styles.root.borderRadius}}>
            </BackgroundComponent>
            {this.state.highlight ? (<View onTouchStart={() => {
                this.setState({
                    highlight: false
                })
            }} style={[{
                borderWidth: 2,
                overflow: 'hidden',
                backgroundColor: '#FFFF0033', 
                borderColor: 'orange',
                borderStyle: 'dashed',
                zIndex: 1000,
                borderRadius: 0,
            }, StyleSheet.absoluteFill]}></View>) : null}
            </>
        );
        delete (this.styles.root as any)['backgroundImage'];
        delete (this.styles.root as any)['backgroundPosition'];
        delete (this.styles.root as any)['backgroundResizeMode'];
        delete (this.styles.root as any)['backgroundSize'];
        delete (this.styles.root as any)['backgroundRepeat'];
    }

    public getTestId(suffix?: string) {
        let id = this.props.id || this.props.name;
        if (this.testIdPrefix) {
            id = this.testIdPrefix + '_' + id;
        }
        if (suffix) {
            id = id + '_' + suffix;
        }
        return id;
    }

    public getTestProps(suffix?: string) {
        let id = this.getTestId(suffix);
        if (isScreenReaderEnabled()) {
            return {};
        }
        if (Platform.OS === 'android' || Platform.OS === 'web') {
            return {
                accessibilityLabel: id,
                testID: id
            };
        }
        return {
            accessible: false,
            testID: id
        };
    }

    public getStyleClassName() {
        return this.state.props.classname;
    }

    public getTestPropsForInput(suffix?: string) {
        return this.getTestProps(suffix || 'i');
    }

    public getTestPropsForAction(suffix?: string) {
        return this.getTestProps(suffix || 'a');
    }

    public getTestPropsForLabel(suffix?: string) {
        return this.getTestProps(suffix || 'l');
    }

    public getLayoutOfWidget(name: string): {x: number, y: number} | undefined {
        return getPosition(name)
    }

    public scrollToTop(){
        this.notify('scrollToPosition', [{
            x: 0,
            y: 0
        }]);
    }

    public scrollToEnd() {
        this.notify('scrollToEnd', []);
    }

    scrollToPosition(widgetName: string) {
        const positionY = this.getLayoutOfWidget(widgetName)?.y;
        this.notify('scrollToPosition', [{
            x: 0,
            y: positionY,
        }]);
    }
    private getDependenciesFromContext(fn: () => ReactNode) {
        return (
        <TappableContext.Consumer>{(tappable) => {
            this.closestTappable = tappable;
            return (
                <TextIdPrefixConsumer>
                    {(testIdPrefix) => {
                        this.testIdPrefix = testIdPrefix || '';
                        return (<AssetConsumer>
                            {(loadAsset) => {
                            this.loadAsset = loadAsset;
                            return (<ParentContext.Consumer>
                                {(parent) => {
                                    this.setParent(parent);
                                    this._showSkeleton = this.state.props.showskeleton !== false 
                                        && (this.parent?._showSkeleton || this.state.props.showskeleton === true);
                                    return (
                                        <ParentContext.Provider value={this}>
                                            <ThemeConsumer>
                                                {(theme) => {                                
                                                    this.theme = theme || BASE_THEME;
                                                    return fn();
                                                }}
                                            </ThemeConsumer>
                                        </ParentContext.Provider>);
                                }}    
                                </ParentContext.Consumer>);
                            }}
                        </AssetConsumer>);
                    }}
                </TextIdPrefixConsumer>)}}
        </TappableContext.Consumer>); 
    }
    
    public render(): ReactNode {
        const props = this.state.props;
        this.isFixed = false;
        const selectedLocale = this.i18nService.getSelectedLocale();
        return this.getDependenciesFromContext(() => {
            WIDGET_LOGGER.info(() => `${this.props.name || this.constructor.name} is rendering.`);
            this._showView = this._showView || this.showView();
            if (this.state.hide 
                || (!this.isVisible() && this.hideMode === HideMode.DONOT_ADD_TO_DOM)
                || !this._showView) {
                return null;
            }
            const classname = this.getStyleClassName();
            this.styles =  this.theme.mergeStyle(
                this.getDefaultStyles(),
                {text: this.theme.getStyle('app-' + selectedLocale)},
                {text: this.theme.getStyle(this.defaultClass + '-' + selectedLocale)},
                props.disabled ? this.theme.getStyle(this.defaultClass + '-disabled') : null,
                this.isRTL ? this.theme.getStyle(this.defaultClass + '-rtl') : null,
                classname && this.theme.getStyle(classname),
                props.showindevice && this.theme.getStyle('d-all-none ' + props.showindevice.map(d => `d-${d}-flex`).join(' ')),
                this.theme.cleanseStyleProperties(this.props.styles),
                this.theme.cleanseStyleProperties({
                    root: this.styleOverrides,
                    text: this.styleOverrides
                }));
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
        });
    }
}
