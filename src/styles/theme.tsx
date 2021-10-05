import { deepCopy } from '@wavemaker/app-rn-runtime/core/utils';
import { merge } from 'lodash';
import React, { ReactNode } from 'react';
import { TextStyle, ViewStyle, ImageStyle, ImageBackground } from 'react-native';
export const DEFAULT_CLASS = 'DEFAULT_CLASS';
export const DEFAULT_STYLE: NamedStyles<any> = {};

export class Theme {
    private styles: any = {};

    private cache: any = {};

    public static BASE = new Theme();

    private constructor(private parent?:Theme) {

    }

    addStyle<T extends NamedStyles<any>>(name: string, extend: string, style: T) {
        this.styles[name] = deepCopy(this.styles[extend], this.styles[name], style);
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
            style = deepCopy(...(name.split(' ').map(c => this.getStyle(c))));            
        } else {
            style = deepCopy(this.parent && this.parent.getStyle(name), this.styles[name]);
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
        return (
            <ImageBackground 
                source={{uri: background.uri}}
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
})()