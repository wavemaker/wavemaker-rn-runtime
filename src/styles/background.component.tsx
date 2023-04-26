import * as React from 'react';
import { LinearGradient as ExpoLinearGradient, LinearGradientPoint } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { isString } from 'lodash-es';

export interface LinearGradientProps {
    value: string;
    children: any;
    style?: ViewStyle;
    size?: ViewStyle;
    position?: ViewStyle;
}

export interface LinearGradientState {
    colors: string[];
    locations: number[];
    start: LinearGradientPoint;
    end: LinearGradientPoint;
}

const LINEAT_GRADIENT_REGEX = /linear-gradient\((.+)\)$/g;
const BACKGROUND_POSITION_REGEX = /(?<top>[0-9%]+)[a-z]*\s*(?<left>[0-9%]+)[a-z]*/g;
const BACKGROUND_SIZE_REGEX = /(?<width>[0-9%]+)[a-z]*\s*(?<height>[0-9%]+)[a-z]*/g;

class LinearGradient extends React.Component<LinearGradientProps, LinearGradientState> {

    constructor(props: LinearGradientProps) {
        super(props);
        this.state = this.parse();
    }

    parse(val = this.props.value) {
        let state = {} as LinearGradientState;
        const splits = val.split(',').map(v => v.trim());
        let angle = 0;
        const locations: LinearGradientPoint[] = [];
        if (splits[0].endsWith('deg')) {
            angle = (parseInt(splits[0].split('deg')[0]))%360;
            angle = angle < 0 ? (360 + angle) : angle;
            splits.shift();
        }
        angle += 90;
        const delta = Math.round(Math.tan((angle * Math.PI) / 180) * 100)/100;
        if (Math.abs(delta) > 1) {
            state = {
                end: {
                    x: -0.5 / delta + 0.5,
                    y: 0
                },
                start: {
                    x: 0.5 / delta + 0.5,
                    y: 1
                }
            }  as LinearGradientState;
        } else {
            state = {
                start: {
                    x: 0,
                    y: -0.5 * delta + 0.5
                },
                end: {
                    x: 1,
                    y: 0.5 * delta + 0.5
                }
            }  as LinearGradientState;
        }
        if (angle >= 270 && angle <= 450) {
            state = {
                start : state.end,
                end: state.start
            } as LinearGradientState;
        }
        state.colors = [];
        state.locations = [];
        splits.map(s => {
            const p = s.matchAll(/\s*([0-9]+)%/g).next()?.value;
            if (p) {
                state.locations.push(parseInt(p[1]) / 100);
                state.colors.push(s.replace(p[0], ''));
            } else {
                state.locations.push(null as any);
                state.colors.push(s);
            }
        });
        return state;
    }

    componentDidUpdate(prevProps: Readonly<LinearGradientProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.value !== this.props.value) {
            this.setState(this.parse());
        }
    }
    

    public render() {
        return (
            <View style={[this.props.style, {borderWidth: 0, overflow: 'hidden'}]}>
                <View style={[StyleSheet.absoluteFill]}>
                    <ExpoLinearGradient
                        colors={this.state.colors}
                        locations={this.state.locations}
                        start={this.state.start}
                        end={this.state.end}
                        style={[
                            this.props.size?.width ? this.props.size : StyleSheet.absoluteFill,
                            this.props.position,
                            {position: 'absolute', borderRadius: this.props.style?.borderRadius}
                        ]}
                    />
                </View>
                {this.props.children}
            </View>
        );
    }
}

export interface BackgroundProps {
    image?: string;
    position?: string;
    children?: any;
    style?: ViewStyle;
    size: string;
}

interface BackgroundState {

}

export class BackgroundComponent extends React.Component<BackgroundProps, BackgroundState> {

    constructor(props: BackgroundProps) {
        super(props);
    }

    public getPositionAndSize() {
        const result: {
            resizeMode? : string,
            position?: {
                top?: string | number,
                left?: string | number,
            },
            size?: {
                width?: string | number,
                height? : string | number
            }
        } = {} as any;
        if (this.props.position === 'center') {
            result.resizeMode = 'center';
        } else if (this.props.size === 'contain' || this.props.size === 'cover') {
            result.resizeMode = this.props.size;
            return result;
        }
        const size = this.props.size?.matchAll(BACKGROUND_SIZE_REGEX).next().value?.groups as any;
        if (size) {
            result.size = {};
            result.size.width = size.width.endsWith('%') ? size.width : parseInt(size.width);
            result.size.height = size.height.endsWith('%') ? size.height : parseInt(size.height);
        }
        if (!result.resizeMode && this.props.position) {
            result.position = {};
            const position = this.props.position.matchAll(BACKGROUND_POSITION_REGEX).next().value?.groups as any;
            result.position.top = position.top.endsWith('%') ? position.top : parseInt(position.top);
            result.position.left = position.left.endsWith('%') ? position.left : parseInt(position.left);
        }
        return result;
    }

    public renderLinearGradient(data: string) {
        const psresult = this.getPositionAndSize();
        return  (
            <LinearGradient
                value={data || ''}
                style={this.props.style}
                size={psresult.size}
                position={psresult.position}>
                {this.props.children}
            </LinearGradient>
        );
    }

    public renderImage() {
        let source = this.props.image as any;
        if (isString(source) && (
            source.startsWith('data:') ||
            source.startsWith('http') || 
            source.startsWith('file:'))) {
          source = {
            uri: source
          };
        }
        const psresult = this.getPositionAndSize();
        return (
            <View style={this.props.style}>
                <ImageBackground
                    source={source}
                    resizeMode={psresult.resizeMode as any}
                    imageStyle={(psresult.resizeMode ? null : psresult.size)as any}>
                    {this.props.children}
                </ImageBackground>
            </View>);
    }

    public render() {
        const gradientData = this.props.image?.trim().matchAll(LINEAT_GRADIENT_REGEX).next();
        if (gradientData?.value?.length) {
            return this.renderLinearGradient(gradientData.value[1]);
        } else if (this.props.image) {
            return this.renderImage();
        }
        return (
        <View style={this.props.style}>
            {this.props.children}
        </View>);
    }
}

