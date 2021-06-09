import React from 'react';
import { Image, View } from 'react-native';
import { Tappable } from '@wavemaker/app-rn-runtime/core/tappable.component';
import { AllStyle } from '@wavemaker/app-rn-runtime/styles/theme';
import { BaseComponent, BaseComponentState } from '@wavemaker/app-rn-runtime/core/base.component';

import WmPictureProps from './picture.props';
import { DEFAULT_CLASS, DEFAULT_STYLES, WmPictureStyles } from './picture.styles';

export class WmPictureState extends BaseComponentState<WmPictureProps> {
  naturalImageWidth: number = 0;
  naturalImageHeight: number = 0;
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

  computeImageSize() {
    let imageWidth = this.styles.root.width as number;
    let imageHeight = this.styles.root.height as number;
    if (!imageWidth) {
      if (imageHeight && this.state.naturalImageHeight) {
        imageWidth = imageHeight * this.state.naturalImageWidth / this.state.naturalImageHeight;
      } else {
        imageWidth = this.state.naturalImageWidth;
      }
    }
    if (!imageHeight) {
      if (imageWidth && this.state.naturalImageWidth) {
        imageHeight = imageWidth * this.state.naturalImageHeight / this.state.naturalImageWidth;
      } else {
        imageHeight = this.state.naturalImageHeight;
      }
    }
    return [imageWidth, imageHeight];
  }
  
  createShape(shape: string | undefined, imageWidth: number): WmPictureStyles {
    if (shape) {
      switch(shape) {
        case 'circle': 
          return {
            picture: {
              borderRadius: imageWidth / 2
            }
          } as WmPictureStyles;
        case 'rounded' : 
          return (this.props.themeToUse?.getStyle('rounded-image') as WmPictureStyles);
        case 'thumbnail' : 
          return (this.props.themeToUse?.getStyle('thumbnail-image') as WmPictureStyles);
      }
    }
    return {} as WmPictureStyles;
  }

  renderWidget(props: WmPictureProps) {
    const [imageWidth, imageHeight] = this.computeImageSize();
    const shapeStyles = this.createShape(props.shape, imageWidth);
    const src = props.picturesource || props.pictureplaceholder;
    return src ? (
      <Tappable target={this}>
        <View style={[this.styles.root, {height: imageHeight, width: imageWidth}, shapeStyles.root]}>
          <Image style={[this.styles.picture, shapeStyles.picture]} resizeMode={'stretch'} source={{
            uri: src}}/>
        </View>
      </Tappable>
    ): null;
  }
}
