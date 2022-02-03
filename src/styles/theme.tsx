import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { requestPermissionsAsync } from 'expo-contacts';
import { clone, cloneDeep, forEach, flatten, isArray, isEmpty, isObject, isString, get, mapKeys, reverse } from 'lodash';
import React, { ReactNode } from 'react';
import { TextStyle, ViewStyle, ImageStyle, ImageBackground } from 'react-native';
import ThemeVariables from './theme.variables';
export const DEFAULT_CLASS = 'DEFAULT_CLASS';
export const DEFAULT_STYLE: NamedStyles<any> = {};

export class Theme {
    private styles: any = {};

    private cache: any = {};

    public static BASE = new Theme(null as any, 'default');

    private traceEnabled = false;

    private constructor(private parent:Theme, public readonly name: string) {
        //this.traceEnabled = parent && parent.traceEnabled;
    }

    addStyle<T extends NamedStyles<any>>(name: string, extend: string, style: T) {
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
            const clonedStryle = cloneDeep(this.styles[name]);
            style = deepCopy(parentStyle, this.styles[name]);
            this.addTrace(`@${this.name}:${name}`, style, clonedStryle, parentStyle);
        }
        this.cache[name] = style;
        return style;
    }

    $new(name = "", styles = DEFAULT_STYLE) {
        const newTheme = new Theme(this, name);
        Object.keys(styles).forEach(k => {
            newTheme.addStyle(k, '', styles[k] as any);
        });
        return newTheme;
    }
}
export default Theme.BASE;
export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle | NamedStyles<T>};
export type BackgroundImageStyle = {
    backgroundImage: string,
    backgroundPosition: string,
    backgroundRepeat: string,
    backgroundSize: string | number
};
export const attachBackground = (c: ReactNode, style: ViewStyle) => {
    const background = (style as any)._background;
    if (background) {
        const backgroundStyle = {
            width: style.width,
            height: style.height
        } as any;
        Object.keys(background).forEach(k => {
            if (k !== 'imageStyle') {
                backgroundStyle[k] = background[k];
            }
        });
        const imgSrc = background.uri;
        let source;
        if (isString(imgSrc) && (imgSrc.startsWith('http') || imgSrc.startsWith('file:'))) {
          source = {
            uri: imgSrc
          };
        } else {
          source = imgSrc;
        }
        return (
            <ImageBackground
                source={source}
                resizeMode={background.resizeMode || 'repeat'}
                imageStyle={background.imageStyle}
                style={backgroundStyle}>
                    {c}
            </ImageBackground>);
    }
    return c;
};
export type AllStyle = (ViewStyle & TextStyle & ImageStyle);

const ThemeContext = React.createContext<Theme>(null as any);

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;
/**
 * Common styles
 */
(() => {
    const addColStyles = (device: string) => {
        for(let i = 1; i <= 12; i++) {
            Theme.BASE.addStyle(`col-${device}-${i}`, '', {
                root: {
                    flex: i
                }
            })
        }
    };
    addColStyles('xs');
    addColStyles('sm');
    addColStyles('md');
    addColStyles('lg');

    const addElevationClasses = () => {
        for(let i = 1; i <= 10; i++) {
            Theme.BASE.addStyle(`elevate${i}`, '', {
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
    Theme.BASE.addStyle('hidden', '', {
        root: {
            width: 0,
            height: 0,
            transform: [{ scale: 0 }]
        }
    });
})();

(() => {
    Theme.BASE.addStyle('bg-danger', '', { root: { backgroundColor: ThemeVariables.dangerColor }});
    Theme.BASE.addStyle('bg-info', '', { root: { backgroundColor: ThemeVariables.infoColor }});
    Theme.BASE.addStyle('bg-primary', '', { root: { backgroundColor: ThemeVariables.primaryColor }});
    Theme.BASE.addStyle('bg-success', '', { root: { backgroundColor: ThemeVariables.successColor }});
    Theme.BASE.addStyle('bg-warning', '', { root: { backgroundColor: ThemeVariables.warningColor }});
})();

(() => {
    Theme.BASE.addStyle('border-danger', '', { root: { borderColor: ThemeVariables.dangerColor }});
    Theme.BASE.addStyle('border-info', '', { root: { borderColor: ThemeVariables.infoColor }});
    Theme.BASE.addStyle('border-primary', '', { root: { borderColor: ThemeVariables.primaryColor }});
    Theme.BASE.addStyle('border-success', '', { root: { borderColor: ThemeVariables.successColor }});
    Theme.BASE.addStyle('border-warning', '', { root: { borderColor: ThemeVariables.warningColor }});
})();
