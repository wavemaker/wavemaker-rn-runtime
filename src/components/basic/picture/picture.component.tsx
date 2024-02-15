import React from 'react';
import { DimensionValue, Image, LayoutChangeEvent, View } from 'react-native';
// import { NumberProp, SvgUri } from 'react-native-svg';
import { isNumber, isString } from 'lodash-es';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import ImageSizeEstimator from '@wavemaker/app-rn-runtime/core/imageSizeEstimator';
import { isFullPathUrl, isWebPreviewMode } from '@wavemaker/app-rn-runtime/core/utils';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, WmPictureStyles } from './picture.styles';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';
import WmSkeleton, { createSkeleton } from '../skeleton/skeleton.component';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
}

export default class WmPicture extends BaseComponent<WmPictureProps, WmPictureState, WmPictureStyles> {

  private _pictureSource = null as any;
  private _picturePlaceHolder = null as any;

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, new WmPictureProps());
  }

  loadImage(image: string | undefined) {
    if (!image || !this.loadAsset) {
      return null;
    }
    const imageSrc = this.loadAsset(image) as any;
    if (imageSrc && typeof imageSrc === 'object' && typeof imageSrc.default === 'function') {
      return null;
    }
    if (isNumber(imageSrc)) {
      const {width, height} = Image.resolveAssetSource(imageSrc);
      this.updateState({
        naturalImageWidth: width,
        naturalImageHeight: height
      } as WmPictureState);
    } else if (imageSrc !== null) {
      const cancel = ImageSizeEstimator.getSize(imageSrc, (width: number, height: number) => {
        this.updateState({
          naturalImageWidth: width,
          naturalImageHeight: height
        } as WmPictureState);
        this.cleanup.splice(this.cleanup.indexOf(cancel), 1);
      });
      this.cleanup.push(cancel);
    }
    return imageSrc;
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    switch(name) {
      case 'picturesource':
        this._pictureSource = null;
      case 'pictureplaceholder':
        this._picturePlaceHolder = null;
        break;
    }
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    let imageWidth = e.nativeEvent.layout.width;
    let imageHeight = e.nativeEvent.layout.height;
    if (!imageWidth && !imageHeight) {
      return;
    }
    if (!this.styles.root.height
        || (typeof this.styles.root.height === 'string'
          && !this.styles.root.height.includes('%'))) {
        imageHeight = 0;
    }
    if (imageWidth && !imageHeight) {
      imageHeight = imageWidth * this.state.naturalImageHeight / this.state.naturalImageWidth;
    } else if (imageHeight && !imageWidth) {
      imageWidth = imageHeight * this.state.naturalImageWidth / this.state.naturalImageHeight;
    }
    this.updateState({
      imageWidth: imageWidth,
      imageHeight: imageHeight
    } as WmPictureState);
  };

  createShape(shape: string | undefined, imageWidth?: number | string): WmPictureStyles {
    if (shape) {
      switch(shape) {
        case 'circle':
          return {
            picture: {
              borderRadius: isNumber(imageWidth) ? imageWidth / 2 : 4
            }
          } as WmPictureStyles;
        case 'rounded' :
          return (this.theme.getStyle('rounded-image') as WmPictureStyles);
        case 'thumbnail' :
          return (this.theme.getStyle('thumbnail-image') as WmPictureStyles);
      }
    }
    return {} as WmPictureStyles;
  }

  getElementToShow(props: WmPictureProps, imgSrc: any, shapeStyles: WmPictureStyles) {
    let elementToshow, source;
    if (imgSrc && typeof imgSrc === 'object' && typeof imgSrc?.default === 'function') {
      let imgStyle : any = {};
      if (props.resizemode === 'contain') {
        imgStyle['width'] = '100%';
        imgStyle['height'] = '100%';
      }
      elementToshow = React.createElement(imgSrc?.default, imgStyle);
    //} else if (!isWebPreviewMode() && props.isSvg) {
    //  svg from uri
    //  elementToshow = <SvgUri testID={this.getTestId('picture')} width={this.styles.root.width as NumberProp} height={this.styles.root.height as NumberProp} uri={imgSrc}/>;
    } else if (isFullPathUrl(imgSrc)) {
      source = {
        uri: imgSrc
      };
    } else {
      source = imgSrc;
    }
    if (this.state.naturalImageWidth) {
      elementToshow = <Image testID={this.getTestId('picture')} style={[this.styles.picture, shapeStyles.picture]} resizeMode={props.resizemode} source={source}/>;
    }
    return elementToshow;
  }
  
  public renderSkeleton(props: WmPictureProps){
    const imageWidth = this.state.imageWidth;
    const imageHeight = this.state.imageHeight;
    const shapeStyles = this.createShape(this.props.shape, imageWidth);
    const skeletonWidth = this.props.skeletonwidth || this.styles.root?.width || shapeStyles.root?.width || shapeStyles.picture?.width || imageWidth; 
    const skeletonHeight = this.props.skeletonheight || this.styles.root?.height || shapeStyles.root?.height || shapeStyles.picture?.height || imageHeight;
    return createSkeleton(this.theme, this.styles.skeleton, {
      ...this.styles.root,
      borderRadius:  this.props.shape == 'circle' && this.styles.root?.width ? 25 : shapeStyles.picture?.borderRadius || shapeStyles.root?.borderRadius || this.styles.root?.borderRadius || 4,
      width: skeletonWidth as DimensionValue,
      height: skeletonHeight as DimensionValue
    });
  }

  renderWidget(props: WmPictureProps) {
    const imageWidth = this.state.imageWidth;
    const imageHeight = this.state.imageHeight;
    const shapeStyles = this.createShape(props.shape, imageWidth);
    this._pictureSource =  this._pictureSource || this.loadImage(props.picturesource);
    this._picturePlaceHolder = this._picturePlaceHolder || this.loadImage(props.pictureplaceholder);
    const imgSrc: any = this._pictureSource || this._picturePlaceHolder;
    let elementToshow;
    if (imgSrc) {
      elementToshow = this.getElementToShow(props, imgSrc, shapeStyles);
    }
    return imgSrc && (this.state.naturalImageWidth || props.isSvg) ? (
      <View style={[{
        width: imageWidth,
        height: imageHeight
      }, this.styles.root, shapeStyles.root, shapeStyles.picture]}>
        {this._background}
      <View style={[{overflow: 'hidden', width: '100%',
        height: '100%'}]} onLayout={this.onViewLayoutChange}>
        <Tappable 
          {...this.getTestPropsForAction()}
          rippleColor={this.styles.root.rippleColor}
          target={this} styles={{width: imageWidth ? null : '100%', height: imageHeight ? null : '100%'}}>
          <Animatedview entryanimation={props.animation} style={[{
                height: imageHeight,
                width: imageWidth,
                borderRadius: shapeStyles.picture?.borderRadius
              }]}>
              {this.state.imageWidth ? elementToshow : null}
            </Animatedview>
          </Tappable>
        </View>
      </View>
    ): null;
  }
}
