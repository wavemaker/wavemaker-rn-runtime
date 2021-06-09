import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { merge } from 'lodash';
import React from 'react';
import { TextStyle, ViewStyle, ImageStyle } from 'react-native';
export const DEFAULT_CLASS = 'DEFAULT_CLASS';
export const DEFAULT_STYLE: NamedStyles<any> = {};

export class Theme {
    private styles: any = {};

    private cache: any = {};

    public static BASE = new Theme();

    private constructor(private parent?:Theme) {

    }

    addStyle<T extends NamedStyles<any>>(name: string, extend: string, style: T) {
        this.styles[name] = deepCopy({}, this.styles[extend], this.styles[name], style);
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
            style = merge({}, ...(name.split(' ').map(c => this.getStyle(c))));            
        } else {
            style = merge({}, this.parent && this.parent.getStyle(name), this.styles[name]);
        }
        this.cache[name] = style;
        return style;
    }

    $new(styles = DEFAULT_STYLE) {
        const newTheme = new Theme(this);
        Object.keys(styles).forEach(k => {
            newTheme.addStyle(k, '', styles[k] as any);
        });
        return newTheme;
    }
}
export default Theme.BASE;
export type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle | NamedStyles<T>};
export type AllStyle = ViewStyle | TextStyle | ImageStyle;

const ThemeContext = React.createContext<Theme>(null as any);

export const ThemeProvider = ThemeContext.Provider;
export const ThemeConsumer = ThemeContext.Consumer;