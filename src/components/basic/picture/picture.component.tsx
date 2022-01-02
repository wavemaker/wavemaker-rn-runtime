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
    let imageWidth = e.nativeEvent.layout.width;
    let imageHeight = e.nativeEvent.layout.height;
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

  renderWidget(props: WmPictureProps) {
    const imageWidth = this.state.imageWidth;
    const imageHeight = this.state.imageHeight;
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
      <View style={this.styles.root}
          onLayout={this.onViewLayoutChange}>
        <Tappable target={this} styles={{width: '100%', height: '100%'}}>
            <Animatedview entryanimation={props.animation} style={[{
                height: imageHeight,
                width: imageWidth,
                borderRadius: shapeStyles.picture?.borderRadius
              }, shapeStyles.root]}>
              {this.state.imageWidth ? <Image style={[this.styles.picture, shapeStyles.picture]}
                resizeMode={'stretch'}
                source={source}/> : null }
            </Animatedview>
          </Tappable>
      </View>
    ): null;
  }
}
