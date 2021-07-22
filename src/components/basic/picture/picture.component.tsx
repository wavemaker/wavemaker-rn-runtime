import React from 'react';
import { Image, LayoutChangeEvent, View } from 'react-native';
import { isNumber, isString } from 'lodash-es';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPictureStyles } from './picture.styles';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
  imageWidth: number = 0;
  imageHeight: number = 0;
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
        Image.getSize(imageSrc, (width: number, height: number) => {
          this.updateState({
            naturalImageWidth: width, 
            naturalImageHeight: height
          } as WmPictureState);
        }, () => {});
        break;
    }
  }

  onImageLayoutChange = (e: LayoutChangeEvent) => {
    let imageWidth = this.styles.root.width;
    let imageHeight = this.styles.root.height;
    if (imageWidth && imageHeight) {
      this.updateState({
        imageWidth: imageWidth,
        imageHeight: imageHeight
      } as WmPictureState);
    } else if (!imageWidth && !imageHeight) {
      this.updateState({
        imageWidth: this.state.naturalImageWidth,
        imageHeight: this.state.naturalImageHeight
      } as WmPictureState);
    } else if (imageWidth && !imageHeight) {
      imageHeight = e.nativeEvent.layout.width * this.state.naturalImageHeight / this.state.naturalImageWidth;
      this.updateState({
        imageHeight: imageHeight
      } as WmPictureState);
    } else if (imageHeight && !imageWidth) {
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
    const src = props.picturesource || props.pictureplaceholder;
    return src && this.state.naturalImageWidth ? (
      <Tappable target={this}>
        <View style={[this.styles.root, {
            height: imageHeight,
            width: imageWidth,
            borderRadius: shapeStyles.picture?.borderRadius
          }, shapeStyles.root]}>
          <Image style={[this.styles.picture, shapeStyles.picture]}
            onLayout={this.onImageLayoutChange}
            resizeMode={'stretch'} source={{
            uri: src}}/>
        </View>
      </Tappable>
    ): null;
  }
}
