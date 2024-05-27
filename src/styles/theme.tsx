import { cloneDeep, isNil, forEach, flatten, isArray, isEmpty, isObject, isString, isFunction, get, reverse } from 'lodash';
import React from 'react';
import { camelCase } from 'lodash-es';
import { TextStyle, ViewStyle, ImageStyle, ImageBackground, Dimensions } from 'react-native';
import { deepCopy, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';
import EventNotifier from '@wavemaker/app-rn-runtime/core/event-notifier';
import ViewPort, {EVENTS as ViewPortEvents} from '@wavemaker/app-rn-runtime/core/viewport';
import MediaQueryList from './MediaQueryList';
import ThemeVariables from './theme.variables';
import { getErrorMessage, getStyleReference, isValidStyleProp } from './style-prop.validator';
export const DEFAULT_CLASS = 'DEFAULT_CLASS';

declare const matchMedia: any, window: any;

if (typeof window !== "undefined") {
    // @ts-ignore: does not properly extend MediaQueryList
    window.matchMedia = (query: string) => new MediaQueryList(query);
}

export const DEVICE_BREAK_POINTS = {
    'MIN_EXTRA_SMALL_DEVICE' : '0px',
    'MAX_EXTRA_SMALL_DEVICE' : '767px',
    'MIN_SMALL_DEVICE' : '768px',
    'MAX_SMALL_DEVICE' : '991px',
    'MIN_MEDIUM_DEVICE' : '992px',
    'MAX_MEDIUM_DEVICE' : '1199px',
    'MIN_LARGE_DEVICE' : '1200px',
    'MAX_LARGE_DEVICE' : '1000000px',
};

export type styleGeneratorFn<T extends NamedStyles<any>> = (
    themeVariables: ThemeVariables,
    addStyle: (name: string, extend: string, style: T) => void) => void

export enum ThemeEvent {
    CHANGE ='change'
};

export class Theme {
    public static BASE = new Theme(null as any, 'default');

    static {
        ViewPort.subscribe(ViewPortEvents.SIZE_CHANGE, () => {
            Theme.BASE.reset();
        });
    }


    private eventNotifer = new EventNotifier();

    private children: Theme[] = [];

    private styles: any = {};

    private cache: any = {};

    private traceEnabled = false;

    private styleGenerators: styleGeneratorFn<any>[] = [];

    private constructor(private parent:Theme, public readonly name: string) {
        if (parent) {
            this.traceEnabled = parent.traceEnabled;
        } else {
            this.traceEnabled = isWebPreviewMode();
        }
    }

    public subscribe(event: ThemeEvent, fn: Function) {
        return this.eventNotifer.subscribe(event, fn);
    }

    public notify(event: ThemeEvent): void {
        this.eventNotifer.notify(event, []);
        this.children.forEach(t => t.notify(event));
    }

    private replaceVariables(val: string) {
        if(isString(val)) { 
            (val.match(/_*var\([^\)]*\)/g) || []).forEach((s) => {
                const variableName = s.substring(4, s.length - 1);
                val = val.replace(s, (ThemeVariables.INSTANCE as any)[variableName]
                    || (ThemeVariables.INSTANCE as any)[variableName.substring(2)]
                    || (ThemeVariables.INSTANCE as any)[camelCase(variableName.substring(2))]);
                val = this.replaceVariables(val);
            });
        }
        return val; 
    }

    clearCache() {
        this.cache = {};
        this.children.forEach((t) => t.clearCache());
    }

    registerStyle<T extends NamedStyles<any>>(fn: styleGeneratorFn<T>) {
        this.styleGenerators.push(fn);
        fn(ThemeVariables.INSTANCE, this.addStyle.bind(this));
    }

    checkStyleProperties(name: string, value : any) {
        if (isObject(value)) {
            Object.keys(value).map((k) => this.checkStyleProperties(k, (value as any)[k]));
        } else if(name && !isValidStyleProp(name, value)) {
            console.log(
                `%cInvalid Style property in ${this.name}: ${getErrorMessage(name, value)}`,
                'background-color: #FF0000;font-weight: bold; color: #fff'
            );
            console.log(`Refer: ${getStyleReference(name)}`);
        }
    }

    private addStyle<T extends NamedStyles<any>>(name: string, extend: string, style: T) {
        this.styles[name] = deepCopy(this.getStyle(extend), this.styles[name], style);
    }

    private addTrace(styleName: string, mergedChildstyle: any, childStyle: any, parentStyle?: any) {
        if (!this.traceEnabled) {
            return;
        }
        let addTrace = !isEmpty(childStyle);
        forEach(mergedChildstyle, (v: any, k: string) => {
            if (v && !isString(v) && !isArray(v) && isObject(v)) {
                addTrace = false;
                this.addTrace(styleName + '.' + k, v, childStyle && childStyle[k], parentStyle && parentStyle[k])
            }
        });
        if (addTrace) {
            mergedChildstyle['__trace'] = [
                {
                    name: styleName,
                    value: childStyle
                },
                ...(parentStyle?.__trace|| [])
            ];
        } else {
            mergedChildstyle['__trace'] = [...(parentStyle?.__trace|| [])];
        }
    }

    private flatten(style: any, prefix = "", result = {} as any) {
        let collect = !isEmpty(style);
        forEach(style, (v: any, k: string) => {
            if (v && !isString(v) && !isArray(v) && isObject(v)) {
                collect = false;
                this.flatten(v, (prefix ?  prefix + '.' : '') + k, result)
            }
        });
        if (collect) {
            result[prefix] = style;
        }
        return result;
    }

    mergeStyle(...styles: any) {
        const style = deepCopy(...styles);
        if (this.traceEnabled) {
            const flattenStyles = this.flatten(style);
            Object.keys(flattenStyles).forEach(k => {
                const s = flattenStyles[k];
                s['__trace'] = flatten(reverse(styles.map((v: any) => {
                    const cs = get(v, k);
                    if (cs && cs.__trace) {
                        return [...cs.__trace];
                    }
                    return [];
                }).filter((t: any) => t.length > 0)));
            });
        }
        return style;
    }

    cleanseStyleProperties(style: any) {
        if (!(style && isObject(style)) || isString(style) || isArray(style)) {
            return;
        }
        style = style as any;
        if (isObject(style) && !isArray(style)) {
            Object.keys(style).forEach(k => {
                (style as any)[k] = this.replaceVariables((style as any)[k]);
            });
        }
        if (!isNil(style['shadowRadius'])) {
            if (style['shadowRadius'] <= 0) {
                style['shadowColor'] = 'transparent';
            } else if (isNil(style['elevation'])) {
                style['elevation'] = 2;
            }
        }
        if (!isNil(style['margin'])) {
            style['marginLeft'] = style['marginLeft'] || style['margin'];
            style['marginRight'] = style['marginRight'] || style['margin'];
            style['marginTop'] = style['marginTop'] || style['margin'];
            style['marginBottom'] = style['marginBottom'] || style['margin'];
            delete style['margin'];
        }
        if (!isNil(style['padding'])) {
            style['paddingLeft'] = style['paddingLeft'] || style['padding'];
            style['paddingRight'] = style['paddingRight'] || style['padding'];
            style['paddingTop'] = style['paddingTop'] || style['padding'];
            style['paddingBottom'] = style['paddingBottom'] || style['padding'];
            delete style['padding'];
        }
        let screenWidth = Dimensions.get('window').width;
        let screenHeight = Dimensions.get('window').height;
        Object.keys(style).forEach((k, i) => {
            let stylePropertyValue = style[k]
            if(typeof stylePropertyValue === 'string' && stylePropertyValue.endsWith('vw')) {
                stylePropertyValue = stylePropertyValue.replace('vw','')
                style[k] = Number(stylePropertyValue)/100 * screenWidth
            }
            if((typeof stylePropertyValue === 'string' && stylePropertyValue.endsWith('vh'))) {
                stylePropertyValue = stylePropertyValue.replace('vh','')
                style[k] = Number(stylePropertyValue)/100 * screenHeight
            }
        })
        Object.keys(style).forEach((k, i) => this.cleanseStyleProperties(style[k]));
    }

    getStyle(name: string) {
        let style = this.cache[name];
        if (style) {
            return style;
        }
        if (!name) {
            return {};
        }
        if (name.indexOf(' ') > 0) {
            style = this.mergeStyle(...(name.split(' ').map(c => this.getStyle(c))));
        } else {
            const parentStyle = this.parent && this.parent.getStyle(name);
            const mediaQuery = (this.styles[name] || {})['@media'];
            let clonedStyle = {};
            if (!mediaQuery || matchMedia(mediaQuery).matches) {
                clonedStyle = cloneDeep(this.styles[name]);
                this.cleanseStyleProperties(clonedStyle);
            }
            if (this !== Theme.BASE && isWebPreviewMode()) {
                this.checkStyleProperties('', clonedStyle);
            }
            style = deepCopy(parentStyle, clonedStyle);
            this.addTrace(`@${this.name}:${name}`, style, clonedStyle, parentStyle);
        }
        this.cache[name] = style;
        return style;
    }

    $new(name = "", styles = {} as NamedStyles<any>) {
        const newTheme = new Theme(this, name);
        newTheme.reset(styles);
        this.children.push(newTheme);
        return newTheme;
    }

    destroy() {
        const i = this.parent.children.indexOf(this);
        if (i >= 0) {
            this.parent.children.splice(i, 1);
        }
    }
    
    getTextStyle(s: any) {
        if (!s) {
            return {};
        }
        return {
            color: s.color,
            fontFamily: s.fontFamily,
            fontSize: s.fontSize,
            fontStyle: s.fontStyle,
            fontWeight: s.fontWeight,
            includeFontPadding: s.includeFontPadding,
            fontVariant: s.fontVariant,
            letterSpacing: s.letterSpacing,
            lineHeight: s.lineHeight,
            textAlign: s.textAlign,
            textAlignVertical: s.textAlignVertical,
            textDecorationColor: s.textDecorationColor,
            textDecorationStyle: s.textDecorationStyle,
            textShadowColor: s.textShadowColor,
            textShadowOffset: s.textShadowOffset,
            textShadowRadius: s.textShadowRadius,
            textTransform: s.textTransform,
            verticalAlign: s.verticalAlign,
            writingDirection: s.writingDirection,
            userSelect: s.userSelect,
        } as TextStyle;
    }

    reset(styles?: NamedStyles<any>) {
        this.styles = {};
        this.clearCache();
        if (styles) {
            this.registerStyle((themeVariables, addStyle) => {
                Object.keys(styles).forEach(k => {
                    addStyle(k, '', styles[k] as any);
                });
            });
        } else {
            this.styleGenerators.forEach(fn => 
                fn(ThemeVariables.INSTANCE, this.addStyle.bind(this)));
        }
        this.notify(ThemeEvent.CHANGE);
    }
}
export default Theme.BASE;
export type NamedStyles<T> = { [P in keyof T]: AllStyle | NamedStyles<T>};
export type BackgroundImageStyle = {
    backgroundImage: string,
    backgroundPosition: string,
    backgroundRepeat: string,
    backgroundSize: string | number
};

export type AllStyle = (ViewStyle & TextStyle & ImageStyle & {userSelect?: 'none'| 'text'} & {rippleColor?: string});

const ThemeContext = React.createContext<Theme>(null as any);

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;
/**
 * Common styles
 */
 Theme.BASE.registerStyle((themeVariables, addStyle) => {
    const addColStyles = (device: string, minWidth: string) => {
        for(let i = 1; i <= 12; i++) {
            addStyle(`col-${device}-${i}`, '', {
                "@media": `(min-width: ${minWidth})`,
                root: {
                    width: (100 * i / 12) + '%'
                }
            } as any)
        }
    };
    addColStyles('xs', DEVICE_BREAK_POINTS.MIN_EXTRA_SMALL_DEVICE);
    addColStyles('sm',  DEVICE_BREAK_POINTS.MIN_SMALL_DEVICE);
    addColStyles('md',  DEVICE_BREAK_POINTS.MIN_MEDIUM_DEVICE);
    addColStyles('lg',  DEVICE_BREAK_POINTS.MIN_LARGE_DEVICE);

    addStyle('d-none', '', {
        root: {
            display: 'none'
        }
    } as any);
    addStyle('d-flex', '', {
        root: {
            display: 'flex'
        }
    } as any);

    const addDisplayStyles = (device: string, minWidth: string, maxWidth: string) => {
        addStyle(`d-${device}-none`, '', {
            "@media": `(min-width: ${minWidth}) and (max-width: ${maxWidth})`,
            root: {
                display: 'none'
            }
        } as any);
        addStyle(`d-${device}-flex`, '', {
            "@media": `(min-width: ${minWidth}) and (max-width: ${maxWidth})`,
            root: {
                display: 'flex'
            }
        } as any);
    };
    addDisplayStyles('all', 
        DEVICE_BREAK_POINTS.MIN_EXTRA_SMALL_DEVICE,
        DEVICE_BREAK_POINTS.MAX_LARGE_DEVICE);
    addDisplayStyles('xs', 
        DEVICE_BREAK_POINTS.MIN_EXTRA_SMALL_DEVICE,
        DEVICE_BREAK_POINTS.MAX_EXTRA_SMALL_DEVICE);
    addDisplayStyles('sm',   
        DEVICE_BREAK_POINTS.MIN_SMALL_DEVICE,
        DEVICE_BREAK_POINTS.MAX_SMALL_DEVICE);
    addDisplayStyles('md',   
        DEVICE_BREAK_POINTS.MIN_MEDIUM_DEVICE,
        DEVICE_BREAK_POINTS.MAX_MEDIUM_DEVICE);
    addDisplayStyles('lg',   
        DEVICE_BREAK_POINTS.MIN_LARGE_DEVICE,
        DEVICE_BREAK_POINTS.MAX_LARGE_DEVICE);

    const addElevationClasses = () => {
        for(let i = 1; i <= 10; i++) {
            addStyle(`elevate${i}`, '', {
                root : {
                    shadowColor: "#000000",
                    shadowOffset: {
                        width: i,
                        height: i,
                    },
                    shadowOpacity: 0.27,
                    shadowRadius: i,
                    elevation: i,
                    zIndex: 1
                }
            });
        }
    };
    addElevationClasses();
    addStyle('hidden', '', {
        root: {
            width: 0,
            height: 0,
            transform: [{ scale: 0 }]
        }
    });
    addStyle('bg-danger', '', { root: { backgroundColor: themeVariables.dangerColor }});
    addStyle('bg-info', '', { root: { backgroundColor: themeVariables.infoColor }});
    addStyle('bg-primary', '', { root: { backgroundColor: themeVariables.primaryColor }});
    addStyle('bg-success', '', { root: { backgroundColor: themeVariables.successColor }});
    addStyle('bg-warning', '', { root: { backgroundColor: themeVariables.warningColor }});

    addStyle('border-danger', '', { root: { borderColor: themeVariables.dangerColor }});
    addStyle('border-info', '', { root: { borderColor: themeVariables.infoColor }});
    addStyle('border-primary', '', { root: { borderColor: themeVariables.primaryColor }});
    addStyle('border-success', '', { root: { borderColor: themeVariables.successColor }});
    addStyle('border-warning', '', { root: { borderColor: themeVariables.warningColor }});

    addStyle('hide-context-menu', '', { text: { userSelect: 'none' }});
});

