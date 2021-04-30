import { StyleSheet } from 'react-native';
import { merge } from 'lodash';
export const DEFAULT_CLASS = 'DEFAULT_CLASS';
export const DEFAULT_STYLE = StyleSheet.create({});

export class Theme {
    private styles: any = {};

    private cache: any = {};

    public static BASE = new Theme();

    private constructor(private parent?:Theme) {

    }

    addStyle(name: string, extend: string, style = DEFAULT_STYLE) {
        this.styles[name] = merge({}, this.styles[extend], this.styles[name], style);
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
            style = merge({}, this.styles[name], this.parent && this.parent.getStyle(name));
        }
        this.cache[name] = style;
        return style;
    }

    $new(styles = DEFAULT_STYLE) {
        const newTheme = new Theme(this);
        newTheme.styles = styles;
        return newTheme;
    }
}

export default Theme.BASE;