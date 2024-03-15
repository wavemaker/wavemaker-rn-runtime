import * as React from 'react';
import { LinearGradient as ExpoLinearGradient, LinearGradientPoint } from 'expo-linear-gradient';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { isEmpty, isNil, isNumber, isString } from 'lodash-es';
import imageSizeEstimator from '@wavemaker/app-rn-runtime/core/imageSizeEstimator';
import { AssetConsumer } from '@wavemaker/app-rn-runtime/core/asset.provider';
import { isFullPathUrl } from '@wavemaker/app-rn-runtime/core/utils';

export interface LinearGradientProps {
    value: string;
    children: any;
    style?: ViewStyle;
    size?: ViewStyle;
    position?: ViewStyle;
    middle?: boolean;
}

export interface LinearGradientState {
    colors: string[];
    locations: number[];
    start: LinearGradientPoint;
    end: LinearGradientPoint;
}

const IMAGE_URL_REGEX = /url\(['|"]?(.+)['|"]?\)$/gi;
const LINEAT_GRADIENT_REGEX = /linear-gradient\((.+)\)$/gi;
const DIMENSION_REGEX = /([0-9%]+)[a-z]*/g;
const BACKGROUND_POSITION_REGEX = /([0-9%]+)[a-z]*\s*([0-9%]+)[a-z]*/g;
const BACKGROUND_SIZE_REGEX = /([0-9%]+)[a-z]*\s*([0-9%]+)[a-z]*/g;

export class LinearGradient extends React.Component<LinearGradientProps, LinearGradientState> {

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
            <View style={[{borderWidth: 0, overflow: 'hidden'}, StyleSheet.absoluteFill, this.props.style]}>
                <View style={[
                    StyleSheet.absoluteFill, this.props.middle ? {
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    } : null]}>
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
    resizeMode?: string;
    repeat?: string;
    style?: ViewStyle;
    size: string;
}

export interface BackgroundState {
    imageSrc: any;
    naturalImageWidth: number,
    naturalImageHeight: number
}

export class BackgroundComponent extends React.Component<BackgroundProps, BackgroundState> {

    private loadAsset: (path: string) => number | string = null as any;

    constructor(props: BackgroundProps) {
        super(props);
        this.state = {} as BackgroundState;
    }

    public caluculateSize(imageSrc: any) {
        if (isNumber(imageSrc)) {
            const {width, height} = Image.resolveAssetSource(imageSrc);
            this.setState({
              naturalImageWidth: width,
              naturalImageHeight: height
            } as BackgroundState);
          } else if (!isNil(imageSrc)) {
            imageSizeEstimator.getSize(imageSrc.uri, (width: number, height: number) => {
              this.setState({
                naturalImageWidth: width,
                naturalImageHeight: height
              } as BackgroundState);
            });
          }
    }

    getDimension(dim: string) {
        if (dim) {
            const value = dim.matchAll(DIMENSION_REGEX).next().value;
            if (value[1]) {
                return value[1].endsWith('%') ? value[1] : parseInt(value[1]);
            }
        }
        return null;
    }

    public getPosition() {
        const result = {} as ViewStyle;
        if (!this.props.position) {
            return result;
        }
        const position = this.props.position.split(' ').map(s => s.trim());
        if (position[0] === 'center') {
            result.alignItems = 'center';
        } else if (position[0] === 'top') {
            result.top = 0;
        } else if (position[0] === 'bottom') {
            result.bottom = 0;
        } else {
            result.top = this.getDimension(position[0]);
        }
        if (position[1] === 'center') {
            result.justifyContent = 'center';
        } else if (position[1] === 'left') {
            result.left = 0;
        } else if (position[1] === 'bottom') {
            result.right = 0;
        } else {
            result.left = this.getDimension(position[1]);
        }
        return result;
    }

    public getPositionAndSize() {
        const result: {
            resizeMode? : string,
            position?: ViewStyle,
            size?: ViewStyle
        } = {} as any;
        if (this.props.resizeMode) {
            result.resizeMode = this.props.resizeMode;
            return result;
        } else if (this.props.position === 'center') {
            result.resizeMode = 'center';
            result.position = {
                justifyContent: 'center',
                alignItems: 'center'
            };
        } else if (this.props.size === 'contain' || this.props.size === 'cover') {
            result.resizeMode = this.props.size;
            return result;
        }
        const size = this.props.size?.matchAll(BACKGROUND_SIZE_REGEX).next().value;
        result.size = {};
        if (size) {
            result.size.width = size[1].endsWith('%') ? size[1] : parseInt(size[1]);
            result.size.height = size[2].endsWith('%') ? size[2] : parseInt(size[2]);
        }
        if (!result.resizeMode && this.props.position) {
            result.position = this.getPosition();
        }
        if (!this.getGradient()?.value?.length) {
            if (this.props.repeat === 'no-repeat') {
                result.size.width = result.size.width || this.state.naturalImageWidth; 
                result.size.height = result.size.height || this.state.naturalImageHeight; 
            } else if (this.props.repeat === 'repeat-x') {
                result.resizeMode = 'repeat';
                result.size.width = result.size.width || '100%'; 
                result.size.height = result.size.height || this.state.naturalImageHeight; 
            } else if (this.props.repeat === 'repeat-y') {
                result.resizeMode = 'repeat';
                result.size.width = result.size.width || this.state.naturalImageWidth; 
                result.size.height = result.size.height || '100%'; 
            } else {
                result.resizeMode = 'repeat';
            }
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
                position={psresult.position}
                middle={psresult.resizeMode === 'center'}>
            </LinearGradient>
        );
    }

    componentDidUpdate(prevProps: Readonly<BackgroundProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (this.props.image && prevProps.image !== this.props.image) {
            this.setImage();
        }
    }

    componentDidMount(): void {
        setTimeout(() => this.setImage(), 100);
    }

    setImage() {
        let source = this.props.image?.trim() as any;
        if (source?.startsWith('url')) {
            source = this.props.image?.matchAll(IMAGE_URL_REGEX).next().value[1];
        }
        if (this.loadAsset) {
            source = this.loadAsset(source);
        }
        if (isFullPathUrl(source)) {
            source = {
                uri: source
            };
        }
        this.caluculateSize(source);
        this.setState({
            imageSrc: source
        } as BackgroundState);
    }

    public getGradient() {
        return this.props.image?.trim().matchAll(LINEAT_GRADIENT_REGEX).next();
    }

    public renderImage() {
        const psresult = this.getPositionAndSize();
        return (
        <AssetConsumer>
            {(loadAsset) => {
            const loadImage = this.loadAsset !== loadAsset;
            this.loadAsset = loadAsset;
            loadImage && this.setImage();
            return (<View style={[{borderWidth: 0, overflow: 'hidden'}, StyleSheet.absoluteFill, this.props.style]}>
                <View style={[
                    StyleSheet.absoluteFill, {
                        flexDirection: 'row',
                        justifyContent: psresult.position?.justifyContent,
                        alignItems: psresult.position?.alignItems
                    }]}>
                    <View style={[
                        { position: 'absolute', overflow: 'hidden' },
                        psresult.position,
                        isEmpty(psresult.size) ?  StyleSheet.absoluteFill : psresult.size
                    ]}>
                        <Image
                            source={this.state.imageSrc}
                            resizeMode={psresult.resizeMode as any || 'cover'}
                            style={[
                                { 
                                    width: '100%',
                                    height: '100%'
                                }, 
                                !isEmpty(psresult.size)
                                    || (psresult.resizeMode === 'cover'
                                        || psresult.resizeMode  === 'contain') ? null : {
                                    minWidth: this.state.naturalImageWidth,
                                    minHeight: this.state.naturalImageHeight
                                }
                            ]}/> 
                    </View>
                </View>
            </View>);
            }}
        </AssetConsumer>
        );
    }

    public render() {
        const gradientData = this.getGradient();
        if (gradientData?.value?.length) {
            return this.renderLinearGradient(gradientData.value[1]);
        } else if (this.props.image && this.state.imageSrc) {
            return this.renderImage();
        }
        return null;
    }
}

