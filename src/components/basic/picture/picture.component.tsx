import React from 'react';
import { Image, LayoutChangeEvent, View } from 'react-native';
import { isNumber, isString } from 'lodash-es';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';
import ImageSizeEstimator from '@wavemaker/app-rn-runtime/core/imageSizeEstimator';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPictureStyles } from './picture.styles';
import { Animatedview } from '@wavemaker/app-rn-runtime/components/basic/animatedview.component';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
  width: number = 0;
  height: number = 0;
}

export default class WmPicture extends BaseComponent<WmPictureProps, WmPictureState, WmPictureStyles> {

  constructor(props: WmPictureProps) {
    super(props, DEFAULT_CLASS, DEFAULT_STYLES, new WmPictureProps());
  }

  onPropertyChange(name: string, $new: any, $old: any) {
    let imageSrc = '';
    switch(name) {
      case 'picturesource':
      case 'pictureplaceholder':
        imageSrc = this.state.props.picturesource || $new;
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
        break;
    }
  }

  onViewLayoutChange = (e: LayoutChangeEvent) => {
    this.updateState({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height
    } as WmPictureState);
  };

  onImageLayoutChange = (e: LayoutChangeEvent) => {
    let sImageWidth = this.state.width;
    let sImageHeight = this.styles.height;
    let imageWidth = e.nativeEvent.layout.width;
    let imageHeight = e.nativeEvent.layout.height;
    if (sImageWidth && sImageHeight) {
      this.updateState({
        imageWidth: imageWidth,
        imageHeight: imageHeight
      } as WmPictureState);
    } else if (!sImageWidth && !sImageHeight) {
      this.updateState({
        imageWidth: this.state.naturalImageWidth,
        imageHeight: this.state.naturalImageHeight
      } as WmPictureState);
    } else if (sImageWidth && !sImageHeight) {
      imageHeight = e.nativeEvent.layout.width * this.state.naturalImageHeight / this.state.naturalImageWidth;
      this.updateState({
        imageHeight: imageHeight
      } as WmPictureState);
    } else if (sImageHeight && !sImageWidth) {
      imageWidth = e.nativeEvent.layout.height * this.state.naturalImageWidth / this.state.naturalImageHeight;
      this.updateState({
        imageWidth: imageWidth
      } as WmPictureState);
    }
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

  renderWidget(props: WmPictureProps) {
    const imageWidth = this.state.imageWidth || this.styles.root.width;
    const imageHeight = this.state.imageHeight || this.styles.root.height;
    const shapeStyles = this.createShape(props.shape, imageWidth);
    const imgSrc = props.picturesource || props.pictureplaceholder;
    let source = {};
    if (imgSrc) {
      if (isString(imgSrc) && (imgSrc.startsWith('http') || imgSrc.startsWith('file:'))) {
        source = {
          uri: imgSrc
        };
      } else {
        source = imgSrc;
      }
    }
    return imgSrc && this.state.naturalImageWidth ? (
      <Tappable target={this}>
        <View style={this.styles.root}
              onLayout={this.onViewLayoutChange}>
          <Animatedview entryanimation={props.animation} style={[{
              height: imageHeight,
              width: imageWidth,
              borderRadius: shapeStyles.picture?.borderRadius
            }, shapeStyles.root]}>
            <Image style={[this.styles.picture, shapeStyles.picture]}
              onLayout={this.onImageLayoutChange}
              resizeMode={'stretch'}
              source={source}/>
          </Animatedview>
        </View>
      </Tappable>
    ): null;
  }
}
